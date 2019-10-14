# Koji Custom VCC SDK
**Extend the Koji Editor with Custom VCCs**

## Getting started

Install the package:
```
npm install --save @withkoji/custom-vcc-sdk
```

Import the package into your app's root and initialize the VCC controller. Assign event listeners for updates:
```
import CustomVcc from '@withkoji/custom-vcc-sdk'
const customVcc = new CustomVcc();

customVcc.onTheme((theme) => {
  // theme is a Koji editor theme of the shape: { colors: {}, mixins: {} }
  // save this value in order to style your VCC to match the user's current theme
});

customVcc.onUpdate((props) => {
  // props is an object containing the VCC's current state. it looks like:
  const {
    type, // the type signature for this vcc
    name, // string name of the VCC
    value, // current value of the VCC
    scope, // name of the section where this vcc appears
    variableName, // resolved variable name of this vcc (`scope.key`)
    options, // an object containing any options passed in `typeOptions`
    collaborationDecoration, // an object containing any collaborators currently focused on this control
  } = props;
});
```

When your app has loaded, register it as a custom VCC to trigger the `on` events from the parent editor:
```
customVcc.register(width, height);
```

When a user changes the VCC's value, update it using:
```
customVcc.change(newValue);
```

It is prefereable to update the rendered value ONLY in response to `onUpdate` events. Calling `change` immediately fires an `onUpdate`.

Calling change is equivalent to a keypress if the user were editing the raw VCC file.

When the value has settled (either blur, or debounce), save the VCC file using:
```
customVcc.save();
```

This will trigger a file save and cause the user's app to be rebuild, so be cautious about saving too frequently.

Optional methods include:
- `customVcc.focus()` to track focus events for live collaboration
- `customVcc.blur()` to track blur events for live collaboration

### Modals

You can trigger the `image`, `sound`, `file`, and `obj` (3D) modals using this SDK and specify callbacks when those modals have been resolved:

```
customVcc.show('image', currentImageUrl, (newUrl) => {
  // change and save VCC to use the new URL value
});
```

### Uploading a file

You can upload a file or blob using:

```
customVcc.uploadFile(blob, fileName, (url) => {
  // url of the uploaded file
});
```

## Publishing a VCC

To publish a VCC, it must be hosted on a `koji-vccs.com` subdomain. To do this, publish your app as normal in Koji, then navigate to the "Custom Domains" section under "Tools". Choose "Add Domain" and select "koji-vccs.com" as the root domain. Specify a unique subdomain and save the domain. You can now use your VCC in projects by specifying the type as `custom<subdomain>` where `subdomain` is the subdomain you chose.

After about 5 minutes, Koji should recognize your app as a VCC and it will appear in the VCCs tag, as well as show some additional information when viewing the published app on withkoji.com
