## Overview

The [Workspaces API](../../../reference/core/latest/workspaces/index.html) offers advanced window management functionalities. Using Workspaces, users are able to arrange multiple applications within the same visual window (called *Frame*). This arrangement can be performed programmatically or by dragging and dropping applications within the Frame. Users can also save Workspace layouts and restore them within the same Frame or even in different Frames.

The Glue42 Workspaces enable the users to compose a custom arrangement of applications by treating each application as an individual building block that can be added, removed, moved or resized within a Workspace. The Frame can hold multiple Workspaces (as tabs) and can also be maximized, minimized or resized. 

## Workspaces Concepts

### Frame

The Frame is a web application (also called Workspaces App). It is the shell that can hold multiple Workspaces as tabs in a single or multiple windows (frames). The Frame application is a vital element in the Workspaces functionality as it handles opening and closing Workspaces, arranging windows in a Workspace, adding or removing Workspaces and windows.

A fully functioning Workspaces App is available in [**Glue42 Enterprise**](https://docs.glue42.com/getting-started/what-is-glue42/general-overview/index.html). For **Glue42 Core** projects, however, you have to create your own Workspaces App. This is extremely simple, as all Workspaces App functionalities are provided as a single React component by the [@glue42/workspaces-ui-react](https://www.npmjs.com/package/@glue42/workspaces-ui-react) library.

*It is important to note that the `<Workspaces>` component provided by the library is not meant to be used as a typical React component. Besides its rendering responsibilities, it also contains heavy logic. This component is meant to allow you to create a dedicated Workspaces App which must function as a standalone window - you must never use it as a part of another application, as this will lead to malfunctioning. The Workspaces App should be customized only using the available extensibility points.*

*For more details on how to create and customize your own Workspaces App, see the [Enabling Workspaces](#enabling_workspaces) section below and the **Glue42 Enterprise** [Extending Workspaces](https://docs.glue42.com/glue42-concepts/windows/workspaces/overview/index.html#extending_workspaces) documentation.*

### Workspace

A Workspace contains one or more applications (windows) arranged in columns, rows or groups of tabbed windows. Each application acts as a building block of a Workspace and can be resized, maximized and restored within a Workspace. Applications can be added to a Workspace (by drag and drop or programmatically) and can also be ejected from a Workspace as floating windows. The arrangement of each Workspace can be uniquely suited to provide the necessary layout and functionalities for performing tasks quickly and intuitively. Instead of wasting time and effort in finding, opening and arranging the relevant applications, restore the respective Workspace with a single click.

### Workspace Layout

A Workspace layout is a JSON object which describes the model of a Workspace. It contains the name of the Workspace, the structure of its children and how they are arranged, the names of each application present in the Workspace, context and other settings. This layout is the blueprint used by the API to build the Workspace and its components.

Through the Workspaces UI the users can create, modify, save and delete a Workspace layout. The Workspace layouts are saved locally through the `IndexedDB` API of the user's browser.

The example below shows the shape of a simple Workspace layout object containing two applications:

```javascript
const layout = {
    children: [
        {
            type: "column",
            children: [
                {
                    type: "group",
                    children: [
                        {
                            type: "window",
                            appName: "clientlist"
                        }
                    ]
                },
                {
                    type: "group",
                    children: [
                        {
                            type: "window",
                            appName: "clientportfolio"
                        }
                    ]
                }
            ]
        }
    ]
};
```

## Enabling Workspaces

Enabling Workspaces means providing a Workspaces App for your project, including the [Workspaces API](../../../reference/core/latest/workspaces/index.html) library in your [Main app](../../../developers/core-concepts/web-platform/overview/index.html) and [Web Client](../../../developers/core-concepts/web-client/overview/index.html) applications and configuring the [Web Platform](https://www.npmjs.com/package/@glue42/web-platform) library in your Main application to support Workspaces.

The [Live Examples](#live_examples) section demonstrates using the Workspaces API. To see the code and experiment with it, open the embedded examples directly in [CodeSandbox](https://codesandbox.io).

### Workspaces App

The Workspaces App (or Frame) is mandatory for using any Workspaces functionality (see [Frame](#workspaces_concepts-frame) in the previous section). For **Glue42 Core** projects you have to create your own Workspaces App using the [@glue42/workspaces-ui-react](https://www.npmjs.com/package/@glue42/workspaces-ui-react) library which provides all functionalities necessary for building a Workspaces App as a single React component.

*It is important to note that the `<Workspaces>` component provided by the library is not meant to be used as a typical React component. Besides its rendering responsibilities, it also contains heavy logic. This component is meant to allow you to create a dedicated Workspaces App which must function as a standalone window - you must never use it as a part of another application, as this will lead to malfunctioning. The Workspaces App should be customized only using the available extensibility points.*

You can use and customize the [Workspaces App template](https://github.com/Glue42/core/tree/master/templates/workspaces-react) provided in the **Glue42 Core** GitHub repo.

*For more details on how to create and customize your own Workspaces App, see the **Glue42 Enterprise** [Extending Workspaces](https://docs.glue42.com/glue42-concepts/windows/workspaces/overview/index.html#extending_workspaces) documentation.*

### Main Application

The [Main app](../../../developers/core-concepts/web-platform/overview/index.html) is the place where you must specify the location of your Workspaces App. Use the `workspaces` property of the configuration object when initializing the Glue42 [Web Platform](https://www.npmjs.com/package/@glue42/web-platform) library to do so:

```javascript
const config = {
    workspaces: {
        src: "https://my-workspaces-app.com"
    }
};
```

This points the Glue42 Web Platform where to look for the Workspaces App which handles all Workspaces logic. Of course, the [Web Platform](../../../developers/core-concepts/web-platform/overview/index.html) app is also a [Web Client](../../../developers/core-concepts/web-client/overview/index.html), so you must provide the [Workspaces API](../../../reference/core/latest/workspaces/index.html) library too:

```javascript
const config = {
    workspaces: {
        src: "https://my-workspaces-app.com"
    },
    glue: {
        libraries: [GlueWorkspaces]
    }
};
```

Finally, you must configure the `layouts` property to ensure that the Workspace layouts will function properly:

```javascript
// Provide the location of your Workspaces App,
// the Workspaces API library and configure the Layouts library.
const config = {
    workspaces: {
        src: "https://my-workspaces-app.com"
    },
    glue: {
        libraries: [GlueWorkspaces]
    },
    layouts: {
        mode: "session",
        // Workspace layout definition objects.
        local: [ {...}, {...}]
    }
};

const { glue } = await GlueWebPlatform(config);
```

By default, the `GlueWebPlatform()` and `GlueWorkspaces()` factory functions are attached to the global `window` object.

The `mode` property accepts two values - `"session"` or `"idb"`. Use the `"idb"` setting if you want the Workspace layouts to be persisted using the `IndexedDB` API of the browser.This option is useful for testing and PoC purposes, because it simulates persisting and manipulating Workspace layouts on a server. The `"session"` setting means that the Workspace layouts will be handled using the browser session storage. Once the browser session is over (e.g., the user closes the Main app window), all user-created layouts will be lost. If the Main app is only refreshed, however, the Workspace layouts will still be available.

The `local` property expects an array of Workspaces layout objects (see [Workspace Layout](#workspaces_concepts-workspace_layout) in the previous section). On startup, these predefined layouts will be imported and merged with the already existing Workspace layouts and the layouts with the same names will be replaced. This ensures that the user-created layouts will not be removed when in `"idb"` mode.

#### Allowing Apps in the "Add Application" Menu 

To control whether an app will be available in the Workspace "Add Application" menu (the dropdown that appears when you click the "+" button to add an application), use the `includeInWorkspaces` property of the `customProperties` top-level key in the application definition object of each app you want to appear in the menu:

```javascript
const config = {
    applications: {
        local: [
            {
                name: "my-app",
                title: "My App",
                type: "window",
                details: {
                    url: "https://my-domain.com/my-app"
                },
                customProperties: {
                    includeInWorkspaces: true
                }
            }
        ]
    },
    workspaces: {...},
    glue: {...},
    layouts: {...}
};

const { glue } = await GlueWebPlatform(config);
```

By default, the `includeInWorkspaces` property is set to `false`.

*For more details on application definitions, see the [Application Management](../../application-management/index.html#application_definitions) section.*

### Web Client Applications

To enable the [Workspaces API](../../../reference/core/latest/workspaces/index.html) in your [Web Client](../../../developers/core-concepts/web-client/overview/index.html) applications, install the [`@glue42/web`](https://www.npmjs.com/package/@glue42/web) and [`@glue42/workspaces-api`](https://www.npmjs.com/package/@glue42/workspaces-api) packages and initialize the [Glue42 Web](../../../reference/core/latest/glue42%20web/index.html) library by passing the `GlueWorkspaces()` factory function in the configuration object. When `GlueWeb()` resolves, the Workspaces API will be accessible through the `workspaces` property of the returned object - e.g., `glue.workspaces`. See below examples of how to enable the Workspaces API in JavaScript, React and Angular applications.

#### JavaScript

Install the necessary packages:

```cmd
npm install --save @glue42/web @glue42/workspaces-api
```

Initialize the Glue42 Web library enabling the Workspaces API:

```javascript
const config = {
    libraries: [GlueWorkspaces]
};
const glue = await GlueWeb(config);

// Now you can access the Workspaces API through `glue.workspaces`.
```

By default, the `GlueWeb()` and `GlueWorkspaces()` factory functions are attached to the global `window` object.

#### React

Install the necessary packages:

```cmd
npm install --save @glue42/react-hooks @glue42/workspaces-api
```

Initialize Glue42 either by: 

- using the `GlueProvider` component:

```javascript
import GlueWeb from "@glue42/web";
import GlueWorkspaces from "@glue42/workspaces-api";
import { GlueProvider } from "@glue42/react-hooks";

const settings = {
    web: {
        factory: GlueWeb,
        config: {
            libraries: [GlueWorkspaces]
        }
    }
};

ReactDOM.render(
    <GlueProvider fallback={<h2>Loading...</h2>} settings={settings}>
        <App />
    </GlueProvider>,
    document.getElementById("root")
);
```

-  or using the `useGlueInit()` hook:

```javascript
import GlueWeb from "@glue42/web";
import GlueWorkspaces from "@glue42/workspaces-api";
import { useGlueInit } from "@glue42/react-hooks";

const App = () => {
    const settings = {
        web: {
            factory: GlueWeb,
            config: {
                libraries: [GlueWorkspaces]
            }
        }
    };
    const glue = useGlueInit(settings);

    return glue ? <Main glue={glue} /> : <Loader />;
};

export default App;
```

#### Angular

Install the necessary packages:

```cmd
npm install --save @glue42/ng @glue42/workspaces-api
```

Pass the `GlueWorkspaces()` factory function to `GlueWeb()` using the `config` object:

```javascript
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { Glue42Ng } from "@glue42/ng";
import GlueWeb from "@glue42/web";
import GlueWorkspaces from "@glue42/workspaces-api";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        Glue42Ng.forRoot({ web: { factory: GlueWeb, config: { libraries: [GlueWorkspaces] } } })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
``` 

## Frame

The [`Frame`](../../../reference/core/latest/workspaces/index.html#!Frame) is the topmost level window which contains all Workspaces. 

### Frame Reference

There are several ways to get a reference to a [`Frame`](../../../reference/core/latest/workspaces/index.html#!Frame) instance.

#### Current Window Frame

Get the [`Frame`](../../../reference/core/latest/workspaces/index.html#!Frame) of the current window by using the [`getMyFrame()`](../../../reference/core/latest/workspaces/index.html#!API-getMyFrame) method:

```javascript
// This method will return the Frame of the current window.
// If an error is thrown, the window is not part of a Workspace.
const frame = await glue.workspaces.getMyFrame().catch(console.error);
```

#### All Frames

Get all [`Frame`](../../../reference/core/latest/workspaces/index.html#!Frame) instances by using the [`getAllFrames()`](../../../reference/core/latest/workspaces/index.html#!API-getAllFrames) method:

```javascript
// Getting all Frames.
const allFrames = await glue.workspaces.getAllFrames();
```

#### Specific Frame

Get a specific [`Frame`](../../../reference/core/latest/workspaces/index.html#!Frame) instance by using the [`getFrame()`](../../../reference/core/latest/workspaces/index.html#!API-getFrame) method:

```javascript
// Getting a specific Frame.
const specificFrame = await glue.workspaces.getFrame(frame => frame.id === "frame-id");
```

### Frame Bounds

Once you get a [`Frame`](../../../reference/core/latest/workspaces/index.html#!Frame) instance, you can manipulate its bounds using the [`move()`](../../../reference/core/latest/workspaces/index.html#!Frame-move) and [`resize()`](../../../reference/core/latest/workspaces/index.html#!Frame-resize) methods: 

```javascript
const myFrame = await glue.workspaces.getMyFrame();

// Moving a Frame.
await myFrame.move({ top: 100, left: 100 });

// Resizing a Frame.
await myFrame.resize({ width: 600, height: 600 });
```

### Focusing a Frame

To bring a [`Frame`](../../../reference/core/latest/workspaces/index.html#!Frame) on focus, use the [`focus()`](../../../reference/core/latest/workspaces/index.html#!Frame-focus) method:

```javascript
const frame = await glue.workspaces.getFrame(frame => frame.id === "frame-id");

// Focusing a Frame.
await frame.focus();
```

### Closing a Frame

To close a [`Frame`](../../../reference/core/latest/workspaces/index.html#!Frame), use the [`close()`](../../../reference/core/latest/workspaces/index.html#!Frame-close) method:

```javascript
const frame = await glue.workspaces.getFrame(frame => frame.id === "frame-id");

// Closing a Frame.
await frame.close();
```

### Frame Workspaces

To get all [`Workspace`](../../../reference/core/latest/workspaces/index.html#!Workspace) objects in a [`Frame`](../../../reference/core/latest/workspaces/index.html#!Frame), use the [`workspaces()`](../../../reference/core/latest/workspaces/index.html#!Frame-workspaces) method:

```javascript
const myFrame = await glue.workspaces.getMyFrame();

// Getting all Workspaces in a Frame.
const frameWorkspaces = await myFrame.workspaces();
```

## Workspace

A [`Workspace`](../../../reference/core/latest/workspaces/index.html#!Workspace) contains one or more application windows arranged in columns, rows or groups. 

*A [`Group`](../../../reference/core/latest/workspaces/index.html#!Group) is a Workspace element that holds tabbed windows. If a window is placed directly in a [`Column`](../../../reference/core/latest/workspaces/index.html#!Column) or a [`Row`](../../../reference/core/latest/workspaces/index.html#!Row), it will be static and without a tab - the user will not be able to move it or close it and manipulating it will be possible only through the API.*  

You can use the [`frame`](../../../reference/core/latest/workspaces/index.html#!Workspace-frame) property of a Workspace to get a reference to the [`Frame`](../../../reference/core/latest/workspaces/index.html#!Frame) containing it. 

To get a collection of the immediate children of a Workspace, use its [`children`](../../../reference/core/latest/workspaces/index.html#!Workspace-children) property.

### Workspace Reference

There are several methods available for getting a reference to a Workspace.

#### Current Window Workspace

To get the Workspace of the current window, use the [`getMyWorkspace()`](../../../reference/core/latest/workspaces/index.html#!Workspace-getMyWorkspace) method:

```javascript
// This method will return the Workspace of the current window.
// If an error is thrown, the window is not part of a Workspace.
const workspace = await glue.workspaces.getMyWorkspace().catch(console.error);
```

#### All Workspaces

To get all Workspaces, use the [`getAllWorkspaces()`](../../../reference/core/latest/workspaces/index.html#!Workspace-getAllWorkspaces) method:

```javascript
// Getting all Workspaces.
const allWorkspaces = await glue.workspaces.getAllWorkspaces();
```

#### Specific Workspace

To get a specific Workspace, use the [`getWorkspace()`](../../../reference/core/latest/workspaces/index.html#!Workspace-getWorkspace) method:

```javascript
// Getting a specific Workspace.
const specificWorkspace = await glue.workspaces.getWorkspace(workspace => workspace.id === "workspace-id");
```

#### Workspace State

The Workspaces are designed to be freely modified programmatically as well as by the end user via the UI. Keeping a correct reference to a modified Workspace instance object is important in order for your code to be able to update the Workspace accordingly. For example, the user may have already closed a Workspace element that you want to update. To avoid such errors, you can either get a new reference to that element using the API, or you can use the [`refreshReference()`](../../../reference/core/latest/workspaces/index.html#!Workspace-refreshReference) method of a Workspace instance:

```javascript
// Updating the reference to an already existing Workspace instance.
await myWorkspace.refreshReference();

// When this resolves, the `myWorkspace` object will be updated to reflect the current Workspace state.
```

### Restoring Workspaces

You can restore a Workspace by using the [`restoreWorkspace()`](../../../reference/core/latest/workspaces/index.html#!API-restoreWorkspace) method which is available at top level of the API. It accepts an optional [`RestoreWorkspaceConfig`](../../../reference/core/latest/workspaces/index.html#!RestoreWorkspaceConfig) object in which you can specify a title and a context for the restored Workspace, and also whether to restore it in a specific existing Frame or in a new Frame: 

```javascript
// Specify the Frame in which to restore the Workspace.
const restoreOptions = {
    frameId: "frame-id"
};

const workspace = await glue.workspaces.restoreWorkspace("myWorkspace", restoreOptions);
```

This method is also available on the frame instance:

```javascript
const myFrame = await glue.workspaces.getMyFrame();

// You don't have to specify a Frame in which to restore the Workspace.
const workspace = await myFrame.restoreWorkspace("myWorkspace");
```

### Creating Workspaces

You can create Workspaces runtime by using the [`createWorkspace()`](../../../reference/core/latest/workspaces/index.html#!API-createWorkspace) method available at top level of the API and on a [`Frame`](../../../reference/core/latest/workspaces/index.html#!Frame) instance. Using the `createWorkspace()` method, however, may often be quite inconvenient as every time you want to create a Workspace you will have to pass a JSON object describing a full Workspace Layout. This layout can quickly become very complex depending on the number and arrangement of applications participating in it. Below is an example of creating a [`Workspace`](../../../reference/core/latest/workspaces/index.html#!Workspace) by passing a [`WorkspaceDefinition`](../../../reference/core/latest/workspaces/index.html#!WorkspaceDefinition) with only two applications arranged in a single column:

```javascript
// Workspace definition.
const definition = {
    // Define all Workspace elements (children).
    children: [
        {
            type: "column",
            children: [
                {
                    type: "window",
                    appName: "app-one"
                },
                {
                    type: "window",
                    appName: "app-two"
                }
            ]
        }
    ],
    // Confugartion for the Workspace.
    config: {
        title: "My Workspace"
    }
};

// Creating a Workspace.
const workspace = await glue.workspaces.createWorkspace(definition);
```

*If you insert an empty [`Column`](../../../reference/core/latest/workspaces/index.html#!Column), [`Row`](../../../reference/core/latest/workspaces/index.html#!Row) or [`Group`](../../../reference/core/latest/workspaces/index.html#!Group) element in a Workspace (without a window as its content), it will be visually represented in the Workspace as an empty space with a grey background and a button in the middle from which the user will be able to add an application. The user will not be able to move or close this empty element.*

#### Workspaces Builder API

An easier solution is to use the Workspaces Builder API. The builder allows you to compose entire Workspaces as well as different Workspace elements (rows, column or groups) depending on the builder type you set.

You can define a builder with the [`getBuilder()`](../../../reference/core/latest/workspaces/index.html#!API-getBuilder) method. It accepts a [`BuilderConfig`](../../../reference/core/latest/workspaces/index.html#!BuilderConfig) object as a parameter in which you should specify the type of the builder (`workspace`, `row`, `colum` or `group`) and provide either a Workspace definition or a definition for the element (row, column or group) you want to build. You can then use the methods of the builder instance to add rows, columns, groups or windows. 

Here is how you can create the same Workspace as above using a builder: 

```javascript
// Configuration for the builder.
const builderConfig = {
    // Type of the builder.
    type: "workspace",
    definition: {
        // This time pass only the the Workspace configuration without defining Workspace children.
        config: {
            title: "My Workspace"
        }
    }
};

// Access the Workspaces Builder API and define a builder.
const builder = glue.workspaces.getBuilder(builderConfig);

// Use the builder methods to add a column and two windows in it.
builder.addColumn()
    .addWindow({ appName: "app-one" })
    .addWindow({ appName: "app-two" });

// Finally, use the `create()` method of the builder instance to create the Workspace.
const workspace = await builder.create();
```

### Finding Workspace Elements

The Workspaces API offers various methods for finding elements in a Workspace - [`Row`](../../../reference/core/latest/workspaces/index.html#!Row), [`Column`](../../../reference/core/latest/workspaces/index.html#!Column), [`Group`](../../../reference/core/latest/workspaces/index.html#!Group) and [`WorkspaceWindow`](../../../reference/core/latest/workspaces/index.html#!WorkspaceWindow). All methods for querying Workspaces accept a predicate function as a parameter which you can use to find the desired Workspace elements.

#### Box Elements

[`Box`](../../../reference/core/latest/workspaces/index.html#!Box) elements are Workspace elements that can contain other Workspace elements - [`Row`](../../../reference/core/latest/workspaces/index.html#!Row), [`Column`](../../../reference/core/latest/workspaces/index.html#!Column) and [`Group`](../../../reference/core/latest/workspaces/index.html#!Group). These elements are the building blocks of a Workspace layout, while the actual windows (applications) can be viewed as their content. 

To get all box elements in a Workspace, use the [`getAllBoxes()`](../../../reference/core/latest/workspaces/index.html#!Workspace-getAllBoxes) method of a Workspace instance:

```javascript
const myWorkspace = await glue.workspaces.getMyWorkspace();

// This will return all `Row`, `Column` and `Group` elements in the Workspace.
const allBoxElements = myWorkspace.getAllBoxes();
```

The Workspace instance also offers methods for specific types of box elements. For example, to get all rows in a Workspace, use the [`getAllRows()`](../../../reference/core/latest/workspaces/index.html#!Workspace-getAllRows) method:

```javascript
const myWorkspace = await glue.workspaces.getMyWorkspace();

const allRows = myWorkspace.getAllRows();
```

To get all columns or groups, use the [`getAllColumns()`](../../../reference/core/latest/workspaces/index.html#!Workspace-getAllColumns) or [`getAllGroups()`](../../../reference/core/latest/workspaces/index.html#!Workspace-getAllGroups) method respectively.

You can also get a specific box element using the [`getBox()`](../../../reference/core/latest/workspaces/index.html#!API-getBox) method available on top level of the API as well as on a Workspace instance. Below is an example of getting the immediate parent element of a window using the window ID:

```javascript
const myWorkspace = await glue.workspaces.getMyWorkspace();

// The `getBox()` method (as most methods for querying Workspaces)
// accepts a predicate function used to find the desired elements.
const targetElement = myWorkspace.getBox((boxElement) => {
    return boxElement.children.some(child => child.type === "window" && child.id === "target-id");
});
```

The Workspace instance also offers methods for finding specific rows, columns or groups - [`getRow()`](../../../reference/core/latest/workspaces/index.html#!Workspace-getRow), [`getColumn()`](../../../reference/core/latest/workspaces/index.html#!Workspace-getColumn) and [`getGroup()`](../../../reference/core/latest/workspaces/index.html#!Workspace-getGroup).

#### Workspace Windows

To get all windows in a Workspace, use the [`getAllWindows()`](../../../reference/core/latest/workspaces/index.html#!Workspace-getAllWindows) method of a Workspace instance:

```javascript
const myWorkspace = await glue.workspaces.getMyWorkspace();

const allWorkspaceWindows = myWorkspace.getAllWindows();
```

To get a specific window, use the [`getWindow()`](../../../reference/core/latest/workspaces/index.html#!API-getWindow) method available on top level of the API as well as on a Workspace instance:

```javascript
const specificWindow = await glue.workspaces.getWindow(window => window.id === "target-id");
```

### Editing Workspaces

Workspace instances and [`Box`](../../../reference/core/latest/workspaces/index.html#!Box) element instances offer methods for adding and removing Workspace elements. This, combined with the powerful querying methods, gives you full programmatic control over a Workspace. 

Below is an example of adding a new window as a sibling to another window in a Workspace using the [`addWindow()`](../../../reference/core/latest/workspaces/index.html#!Box-addWindow) method of a box element:

```javascript
const myWorkspace = await glue.workspaces.getMyWorkspace();

const targetElement = myWorkspace.getBox((boxElement) => {
    return boxElement.children.some(child => child.type === "window" && child.id === "targetId");
});

await targetElement.addWindow({ appName: "app-three" });
```

### Workspace Layouts

Workspace layouts are JSON objects that describe the content and arrangement of a Workspace.

#### Workspace Layout Summaries

You can get the summaries of all Workspace layouts without the extensive JSON objects describing their structure. For example, you may need only the names of the available layouts to list them in the UI:

```javascript
const layoutSummaries = await glue.workspaces.layouts.getSummaries();
const allLayoutNames = layoutSummaries.map(summary => summary.name);
```

#### Saving Workspace Layouts

You can save the layout of a Workspace after you create it by using the [`saveLayout()`](../../../reference/core/latest/workspaces/index.html#!Workspace-saveLayout) method of a Workspace instance:

```javascript
// Saving the layout of a previously created Workspace instance.
await workspace.saveLayout("my-workspace");
```

You can also save the layout of any opened Workspace using the Workspaces Layouts API and the ID of the Workspace:

```javascript
await glue.workspaces.layouts.save({ name: "workspace-two", workspaceId: "workspace-id" });
```

#### Deleting Workspace Layouts

Deleting a layout by name:

```javascript
await glue.workspaces.layouts.delete("workspace-one");
```

## Workspace Context

Each Workspace instance has a dedicated context (based on [Shared Contexts](../../data-sharing-between-apps/shared-contexts/index.html)). Use the Workspace context to pass custom data to the Workspace applications when creating or restoring a Workspace.

### Initial

To specify initial context data when creating a Workspace, use the `context` property of the [`WorkspaceDefinition`](../../../reference/core/latest/workspaces/index.html#!WorkspaceDefinition) object:

```javascript
const definition = {
    context: { clientID: 1 }
};

const workspace = await glue.workspaces.createWorkspace(definition);
```

To specify initial context data when restoring a Workspace, use the `context` property of the [`RestoreWorkspaceConfig`](../../../reference/core/latest/workspaces/index.html#!RestoreWorkspaceConfig) object:

```javascript
const restoreOptions = {
    context: { clientID: 1 }
};

const workspace = await glue.workspaces.restoreWorkspace("myWorkspace", restoreOptions);
```

### Get

To get the Workspace context, use the [`getContext()`](../../../reference/core/latest/workspaces/index.html#!Workspace-getContext) method of a Workspace instance:

```javascript
const context = await myWorkspace.getContext();
```

### Set

To set the Workspace context, use the [`setContext()`](../../../reference/core/latest/workspaces/index.html#!Workspace-setContext) method of a Workspace instance. Using this method will overwrite entirely the existing context:

```javascript
const newContext = { instrument: "MSFT" };

await myWorkspace.setContext(newContext);
```

### Update

To update the Workspace context, use the [`updateContext()`](../../../reference/core/latest/workspaces/index.html#!Workspace-updateContext) method of a Workspace instance. Using this method will merge the update with the existing context:

```javascript
// Existing context: `{ clientID: 1 }`.
const update = { instrument: "MSFT" };

await myWorkspace.updateContext(update);
// Result: `{ clientID: 1, instrument: "MSFT" }`.
```

## Events

The Workspaces API exposes events at different levels allowing you to listen only for the events you are interested in.

### Global Events

Global events are accessible at top level of the API. Below is an example for an event which will fire every time a window has been added to any Workspace in any Frame:

```javascript
glue.workspaces.onWindowAdded((window) => {
    console.log(`Window added: ${window.id}`);
});
```

All event methods return an unsubscribe function which you can use to stop receiving notifications about the event:

```javascript
const unsubscribe = await glue.workspaces.onWindowAdded((window) => {
    console.log(`Window added: ${window.id}`);
});

unsubscribe();
```

*For more available global events, see the [Workspaces Reference](../../../reference/core/latest/workspaces/index.html#!API).*

### Frame Events

The Frame events provide notifications when a certain action has occurred within the Frame. Below is an example for an event which will fire every time a window has been added to the specified Frame instance: 

```javascript
const myFrame = await glue.workspaces.getMyFrame();

myFrame.onWindowAdded((window) => {
    console.log(`Window added to Frame: ${window.id}`);
});
```

*For more available Frame events, see the [Workspaces Reference](../../../reference/core/latest/workspaces/index.html#!Frame).*

### Workspace Events

The Workspace events provide notifications when a certain action has occurred within the Workspace. Below is an example for an event which will fire every time a window has been added to the specified Workspace instance:

```javascript
const workspace = await glue.workspaces.getMyWorkspace();

workspace.onWindowAdded((window) => {
    console.log(`Window added to Workspace: ${window.id}`);
});
```

*For more available Workspace events, see the [Workspaces Reference](../../../reference/core/latest/workspaces/index.html#!Workspace).*

### Window Events

The window level events provide notifications when a certain action related to the window has occurred. Below is an example for an event which will fire when the window has been removed from the Workspace:

```javascript
const workspaceWindow = await glue.workspaces.getWindow(window => window.id === "my-window-id");

workspaceWindow.onRemoved((window) => {
    console.log(`Window removed from Workspace: ${window.id}`);
});
```

*For more available window events, see the [Workspaces Reference](../../../reference/core/latest/workspaces/index.html#!WorkspaceWindow).* 

## Live Examples

### Restoring and Closing Workspaces

The application below demonstrates how to restore and close programmatically already defined Workspace layouts. Click the "Open" button of either of the two defined Workspaces to open an instance of it. The application will log the ID of the newly opened instance and provide a "Close" button for closing this particular Workspace instance. You can also define a custom context which the restored Workspace will pass to all applications participating in it. You can manipulate freely the restored Workspaces, as in the previous example. 

*Keep in mind that if you create and save a new Workspace, you will have to refresh the app to see the newly saved Workspace layout. If you close a restored Workspace directly from its frame and then try to close it from the "Close" button for its instance, the app will show an error that this Workspace has already been closed.*

<a href="https://codesandbox.io/s/github/Glue42/core/tree/master/live-examples/workspaces/workspaces-listing" target="_blank" class="btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 296" preserveAspectRatio="xMidYMid meet" width="24" height="24" version="1.1" style="pointer-events: auto;">
        <path fill="#000000" d="M 115.498 261.088 L 115.498 154.479 L 23.814 101.729 L 23.814 162.502 L 65.8105 186.849 L 65.8105 232.549 L 115.498 261.088 Z M 139.312 261.715 L 189.917 232.564 L 189.917 185.78 L 232.186 161.285 L 232.186 101.274 L 139.312 154.895 L 139.312 261.715 Z M 219.972 80.8277 L 171.155 52.5391 L 128.292 77.4107 L 85.104 52.5141 L 35.8521 81.1812 L 127.766 134.063 L 219.972 80.8277 Z M 0 222.212 L 0 74.4949 L 127.987 0 L 256 74.182 L 256 221.979 L 127.984 295.723 L 0 222.212 Z" style="pointer-events: auto;"></path>
</svg> Open in CodeSandbox</a>
<div class="d-flex">
    <iframe src="https://jc4z0.csb.app" style="border: none;"></iframe>
</div>

### Manipulating a Workspace

The application above opens a fully functioning Workspace. There are multiple registered apps which you can use to customize the Workspace layout. You can:

- drag and drop the already opened apps to form new rows, columns or window groups;
- maximize and restore a window or window group;
- eject a window from a Workspace;
- reorder the window and Workspace tabs;
- add new application instances to the current Workspace (in the current column, row or group);
- resize the windows in the Workspace by dragging their borders;
- close and restore a Workspace within the same Frame;
- create a new Workspace, customize its layout and save it;

## Reference

[Workspaces API Reference](../../../reference/core/latest/workspaces/index.html) 