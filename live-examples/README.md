# Glue42 Core Live Snippets

This folder contains live snippet examples for the [Glue42 Core documentation](https://core-docs.glue42.com).

## Examples

- Shared Contexts
  - Get and Set Context
  - Subscribing for Context Updates
  - Context Discovery

- Interop
  - Registering and Invoking Methods
  - Targeting Interop Servers
  - Discovering Methods by Name
  - Discovering Methods by Event
  - Discovering Interop Servers
  - Stream Publishing and Subscribing
  - Handling Stream Subscriptions
  - Streaming Events

- Window Management
  - Opening Windows
  - Discovering Windows
  - Window Events
  - Window Operations

- Channels
  - Discovering and Navigating
  - Publishing and Subscribing

- Application Management
  - Discovering Applications
  - Starting Applications
  - Application and Instance Events

## Example Template

Each example project contains the following:

- [Glue42 Core Environment](https://core-docs.glue42.com/developers/core-concepts/environment/overview/index.html) configs.
- A `lib` folder with a built of the [`Glue42 Web`](https://core-docs.glue42.com/reference/core/latest/glue42%20web/index.html) library.
- A `scripts` folder with common functionality (e.g., DOM manipulation utils) or common logic between the applications in an example.
- A `glue` folder - the [Glue42 Core](https://core-docs.glue42.com/getting-started/what-is-glue42-core/index.html) assets. If creating a new example, make sure to have the Glue42 Core assets built in the example folder.

## Setting Up For Local Development

- Open a terminal in the `live-examples` folder and run `npm run install:all` to install the dependencies in all examples.
- When you go to any example, you can run `npm start` to host the example. It runs on `http://localhost:5000`.
- Each example directory contains a `serve.json` file, which configures the routes for the local dev server.
