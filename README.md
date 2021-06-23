# Koji Custom VCC SDK
![npm (scoped)](https://img.shields.io/npm/v/@withkoji/custom-vcc-sdk?color=green&style=flat-square)

**Library for creating custom controls to use in Koji app.**

## Overview

The @withkoji/custom-vcc-sdk package enables you to implement custom controls for capturing user input on the frontend of your Koji app.
With this package, you can provide customizations that is better suited for the application you are developing.
For example, some Koji apps provide tile map editors, sound enhancers, or custom avatar creators to enhance the interactivity in the app.

## Installation

Install the package in your Koji project.

```
npm install --save @withkoji/custom-vcc-sdk
```

## Basic use

### Building custom controls

Import and instantiate CustomVcc.

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

When the custom control has loaded, register it to trigger events from the parent editor.

```
customVcc.register(width, height);
```

When a user changes the value, update it and save the file.

```
customVcc.change(newValue);
customVcc.save();
```

### Using custom controls

To make a custom control accessible to Koji app, you must serve it at a custom domain.
After you publish the project, add a subdomain under the `koji-vccs.com` root domain.

Then, you can use the control in a Koji app in one of these ways.

* (Recommended) With the @withkoji/core package, call the `Koji.ui.capture.custom` method with the subdomain name. For example:

 `const music = await Koji.ui.capture.custom({ name: 'scloud' });`

* (Deprecated) With the @withkoji/vcc package, use the subdomain name as the VCC type. For example:

 `"type": "custom<YOUR-DOMAIN-NAME>"`.

## Related resources

* [Package documentation](https://developer.withkoji.com/reference/customvcc/withkoji-custom-vcc-sdk)
* [Building your first custom VCC](https://developer.withkoji.com/docs/customizations/build-custom-vcc)
* [Custom VCC blueprint](https://developer.withkoji.com/docs/blueprints/cat-selector-blueprint)
* [Koji homepage](http://withkoji.com/)

## Contributions and questions

See the [contributions page](https://developer.withkoji.com/docs/about/contribute-koji-developers) on the developer site for info on how to make contributions to Koji repositories and developer documentation.

For any questions, reach out to the developer community or the `@Koji Team` on our [Discord server](https://discord.com/invite/9egkTWf4ec).
