export interface VccProps {
  type: string;
  name: string;
  value: any;
  scope: string;
  variableName: string;
  envAlias?: string;
  description?: string;
  options: {
    [index: string]: any;
  };
  collaborationDecoration: {
    [index: string]: any;
  };
  _config: {
    [index: string]: any;
  };
}
