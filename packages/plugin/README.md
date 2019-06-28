# `@keyring/plugin`

Base functionality for Keyring plugins and classes hosting plugins

## Usage

```
const Plugin = require('@keyring/plugin');

// For a class that is hosting plugins
class Transaction extends Plugin.Host {
    ...
}

// For a class that is implementing plugin functionality
class MsgpackPlugin extends Plugin.Provider {
    ...
}
```
