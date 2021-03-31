# Ironfish

[![codecov](https://codecov.io/gh/iron-fish/ironfish/branch/master/graph/badge.svg?token=PCSVEVEW5V&flag=ironfish)](https://codecov.io/gh/iron-fish/ironfish)

Ironfish SDK wraps all of the generic components of [Captain](./src/captain/README.md) into a project that is specific to Ironfish.

## Components

### Strategy
It also contains a strategy, which is a collection of implementations that [Captain](./src/captain/README.md) uses to implement coin specific logic.

### Accounts
 An account store used to manage, create, and update Ironfish accounts.

### Config
This represents the IronfishConfig and all of it's options. It's a hierarchical config system that has 3 levels of options. If you use `config.get()` or `config.config` then you'll always get the top level config options.

```
-> config
 -> overrides
    * contains all the overrides, these usually come from the CLI
  -> loaded
     * contains all the values loaded from the users config file
   -> defaults
      * contains all the default values in the config
```

### FileSystem
This is an abtraction on top of any file system related APIs like `path` and `fs` in node. It makes it so you can perform file and file system related methods in a way that works in the browser and node. `NodeFileSystem` is one implementation that works for node.

### RpcServer
This is the server that handles clients connecting and making requests against the RPC routes. This server doesn't have much logic of it's own, but it contains a set of adapters that each implement a transport mechanism.

When the RpcServer starts, so do the transports. They accept messages from clients, construct Requests, and route them into the routing layer which executes the proper route.

#### Adapter
An adapter exists to represent a single transport layer. For example, in an HTTP adapter you might listen on port 80 for requests, construct RPC layer Request objects, and feed them into the routing layer, then render the RPC responses as HTTP responses. See IPCAdapter for an example on how to implement an adapter.

### Logs
By default the log level is set to only display info.

Change the `logLevel` in the config file, from `*:info` to `*debug` if you want verbose logs.

### IronfishSDK
This project contains the IronfishSdk which is just a simple wrapper around the ironfish components like Accounts, Config, and IronfishNode. You can use the individual components when ever you feel like it, though the SDK is aimed at making usage easier.

#### SDK Example

```typescript
// Initialize the SDK
const sdk = await IronfishSdk.init()

// List all accounts from the SDK
console.log(await sdk.accounts.list())

// Get a config option from the SDK
console.log(await sdk.config.get('enableMiningDirector'))

// Start a node from the SDK
const node = sdk.node()
node.start()
```