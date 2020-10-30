# Koji Custom VCC SDK

**Library for creating custom Koji VCCs.**

## Overview

The @withkoji/custom-vcc-sdk package enables you to implement custom Visual Customization Controls (VCCs) for your template.
With this package, you can provide customizations that match closely with the application you are developing.
For example, some Koji templates provide tile map editors, sound enhancers, or custom avatar creators to enhance the interactivity for remixers.

## Installation

Install the package in your Koji project.

```
npm install --save @withkoji/custom-vcc-sdk
```

## Basic use

### CustomVcc

Import and instantiate `CustomVcc`.
```
import CustomVcc from '@withkoji/custom-vcc-sdk'
const customVcc = new CustomVcc();
```
Assign event listeners for updates.
```
customVcc.onTheme((theme) => {
  // Listen to Koji theme to match the styles in your VCC
});

customVcc.onUpdate((props) => {
  // Listen to the VCC's current state
});
```

When the custom VCC has loaded, register it to trigger the `on` events from the parent editor.
```
customVcc.register(width, height);
```

When a user changes the value, update it and save the file.
```
customVcc.change(newValue);
customVcc.save();
```

### Publish a custom VCC

Custom VCCs require a custom domain to be accessible to other Koji templates. In the Koji editor, and add a domain under the `koji-vccs.com` root domain. Then, publish the project.

After you publish your custom VCC, you can use it in a Koji template with the VCC type: `"type": "custom<YOUR-DOMAIN-NAME>"`.

## Related resources

* [Package documentation](https://developer.withkoji.com/reference/packages/withkoji-custom-vcc-sdk)
* [Building your first custom VCC](https://developer.withkoji.com/docs/customizations/build-custom-vcc)
* [Custom VCC blueprint](https://developer.withkoji.com/docs/blueprints/cat-selector-blueprint)
* [Koji homepage](http://withkoji.com/)

## Contributions and questions

See the [contributions page](https://developer.withkoji.com/docs/about/contribute-koji-developers) on the developer site for info on how to make contributions to Koji repositories and developer documentation.

For any questions, reach out to the developer community or the `@Koji Team` on our [Discord server](https://discord.gg/eQuMJF6).
