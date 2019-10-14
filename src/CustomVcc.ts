import * as uuid from 'uuid';

import { VccProps } from './model/VccProps';
import { Theme } from './model/Theme';

const IPCScope = 'KOJI_CUSTOM_VCC';

enum IPCEvent {
  LOADED = 'loaded',

  CHANGE = 'onChange',
  COMMIT = 'onCommit',
  FOCUS = 'onFocus',
  BLUR = 'onBlur',

  SHOW_MODAL = 'onModal',

  PROPS_UPDATED = 'props_updated',
  THEME_SET = 'theme_set',
  MODAL_RESOLVED = 'modal_resolved',

  UPLOAD_FILE = 'upload_file',
  FILE_UPLOADED = 'file_uploaded',
}

export default class CustomVCC {
  // tslint:disable-next-line: variable-name
  private _props: VccProps = {
    type: '',
    name: '',
    value: null,
    scope: '',
    variableName: '',
    options: {},
    collaborationDecoration: {},
  };
  public get props(): VccProps {
    return this._props;
  }

  // tslint:disable-next-line: variable-name
  private _theme: Theme = {
    colors: {},
    mixins: {},
  };
  public get theme(): Theme {
    return this._theme;
  }

  private currentModalId?: string;
  private modalCallback?: (returnValue: any) => void;

  private currentUploadId?: string;
  private uploadCallback?: (url: string) => void;

  private themeCallback?: (theme: Theme) => void;
  private updateCallback?: (props: VccProps) => void;

  private idempotencySkips: string[] = [];

  constructor() {
    // Set the VCC's key for communicating back to the parent
    try {
      const queryString: {[index: string]: any} = window.location.search.replace('?', '').split('&').reduce((acc: {[index: string]: any}, cur) => {
        const [k, v] = cur.split('=');
        acc[k] = v;
        return acc;
      }, {});
      this.props.variableName = queryString.key;
    } catch (err) {
    //
    }

    this.addListener();
  }

  public register(width?: any, height?: any) {
    this.postMessage(IPCEvent.LOADED, {
      height,
      width,
    });
  }

////////////////////////////////////////////////////////////////////////////////
// Callbacks
  public onUpdate(callback: (props: VccProps) => void) {
    this.updateCallback = callback;
  }

  public onTheme(callback: (theme: Theme) => void) {
    this.themeCallback = callback;
  }

////////////////////////////////////////////////////////////////////////////////
// Mutations
  public change(newValue: any) {
    // Invoke the update callback immediately and tag the update so we can skip
    // it when it comes back around
    const idempotencyKey = uuid.v4();
    this.idempotencySkips.push(idempotencyKey);

    this._props.value = newValue;
    if (this.updateCallback) {
      this.updateCallback(this.props);
    }

    this.postMessage(IPCEvent.CHANGE, {
      value: newValue,
    }, idempotencyKey);
  }

  public save() {
    this.postMessage(IPCEvent.COMMIT);
  }

  public focus() {
    this.postMessage(IPCEvent.FOCUS);
  }

  public blur() {
    this.postMessage(IPCEvent.BLUR);
  }

////////////////////////////////////////////////////////////////////////////////
// Shared modals
  public showModal(type: 'image'|'sound'|'obj'|'file', currentValue: any, onComplete: (returnValue: any) => void) {
    this.modalCallback = onComplete;
    this.currentModalId = uuid.v4();
    this.postMessage(IPCEvent.SHOW_MODAL, {
      type,
      callbackId: this.currentModalId,
      currentValue,
    });
  }

////////////////////////////////////////////////////////////////////////////////
// Shared methods
  public uploadFile(file: Blob, fileName: string, onComplete: (url: string) => void) {
    this.uploadCallback = onComplete;
    this.currentUploadId = uuid.v4();

    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.postMessage(IPCEvent.UPLOAD_FILE, {
        callbackId: this.currentUploadId,
        fileName,
        fileData: fileReader.result,
      });
    };
    fileReader.readAsArrayBuffer(file);
  }

////////////////////////////////////////////////////////////////////////////////
// IPC methods
  private addListener() {
    window.addEventListener('message', ({ data }) => {
      if (data._type !== IPCScope) {
        return;
      }

      const {
        _idempotencyKey,
        event,
        payload,
      } = data;

      if (event === IPCEvent.PROPS_UPDATED) {
        this._props = payload;

        if (_idempotencyKey && this.idempotencySkips.find(id => id === _idempotencyKey)) {
          this.idempotencySkips = this.idempotencySkips.filter(id => id !== _idempotencyKey);
          return;
        }

        if (this.updateCallback) {
          this.updateCallback(this.props);
        }
      }

      if (event === IPCEvent.THEME_SET) {
        this._theme = payload;
        if (this.themeCallback) {
          this.themeCallback(this.theme);
        }
      }

      if (event === IPCEvent.MODAL_RESOLVED) {
        const {
          callbackId,
          newValue,
        } = payload;
        if (this.modalCallback && callbackId === this.currentModalId) {
          this.modalCallback(newValue);
          this.currentModalId = undefined;
          this.modalCallback = undefined;
        }
      }

      if (event === IPCEvent.FILE_UPLOADED) {
        const {
          callbackId,
          url,
        } = payload;
        if (this.uploadCallback && callbackId === this.currentUploadId) {
          this.uploadCallback(url);
          this.currentUploadId = undefined;
          this.uploadCallback = undefined;
        }
      }
    });
  }

  private postMessage(event: string, payload?: any, idempotencyKey?: string) {
    if (window.parent) {
      window.parent.postMessage({
        _type: IPCScope,
        _key: this.props.variableName,
        _idempotencyKey: idempotencyKey,
        event,
        payload: payload || null,
      }, '*');
    }
  }
}
