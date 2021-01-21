## Overview

This tutorial will show you how to use **Glue42 Core** features in your applications using the [`@glue42/react-hooks`](https://www.npmjs.com/package/@glue42/react-hooks) package. The applications used in the tutorial are Progressive Web Apps which work both in the browser and on the desktop (after installation). The tutorial includes two applications, **Clients** and **Stocks**, bootstrapped with [Create React App](https://github.com/facebook/create-react-app). The applications have 3 views (windows):

- **Clients** - displays a list of clients. Will be accessible at `http://localhost:3000/`;
- **Stocks** - displays a list of stocks. Will be accessible at `http://localhost:3001/`;
- **Stock Details** - displays details for a stock after the user clicks on a stock in the **Stocks** app. Will be accessible at `http://localhost:3002/`;

As an end result, the users want to be able to run two apps as Progressive Web Apps in separate windows in order to take advantage of their multi-monitor setups. Also, they want the apps, even though in separate windows, to be able to communicate with each other. For example, when a client is selected in the **Clients** app, the **Stocks** app should display only the stocks of the selected client.

## Prerequisites

[Glue42 Core](../../../getting-started/what-is-glue42-core/index.html)

[Glue42 Web library](../../../reference/core/latest/glue42%20web/index.html).

JavaScript (ECMAScript 6 or later)

[React Framework](https://reactjs.org)

[React Hooks](https://reactjs.org/docs/hooks-intro.html)

[Create React App](https://reactjs.org/docs/create-a-new-react-app.html) (CRA)

## Tutorial Structure

The tutorial code is located in the **Glue42 Core** [**GitHub repo**](https://github.com/Glue42/core). There you will find a `/tutorials` directory with the following structure:

```cmd
/tutorials
    /angular
        /solution
        /start
    /guides
        /01_javascript
        /02_react
        /03_angular
    /javascript
        /solution
        /start
    /react
        /solution
        /start
    /rest-server
```

- `/guides` - contains the text files of the tutorials;
- `/javascript`, `/react` and `/angular` - contain the starting files for the tutorials and also a full solution for each of them;
- `/rest-server` - a simple server used in the tutorials to serve the necessary `JSON` data;

**Glue42 Core** is an open-source project, so all feedback and contributions, both to the code base and the tutorials, are welcome.

The tutorial consists of several parts, each one demonstrating different **Glue42 Core** capabilities. Each part depends on completing the previous ones.

## 1. Setup

Clone the **Glue42 Core** [**GitHub repo**](https://github.com/Glue42/core) to get the tutorial files.

### 1.1. Start Files

The React tutorial files are located in the `/tutorials/react` directory. Go to the `/start` directory which contains the starting files for the project. The tutorial examples assume that you will be working in the `/start` directory, but, of course, you can move the files and work from another directory.

The `/start` directory contains the following:

- `Clients` - the **Clients** app bootstrapped with CRA;
- `Stocks` - the **Stocks** app bootstrapped with CRA;
- `index.html` - the project landing page;

The **Clients** and **Stocks** apps contain the following resources:

- `/public` - holds static assets for each application, including a `manifest.json`, `sw.js` (Service Worker), icons and an `index.html` file;
- `/src` - holds the main entry point - `index.js`, and the `Clients.jsx`/`Stocks.jsx` react component. Also, a `glue.js` file (methods for interaction with the Glue42 framework), CSS files and a `serviceWorker` file which only registers the Service Worker for the app;
- `.env` - environment variables for CRA;
- `config-overrides.js` - defines additional WebPack configuration to resolve `react` and `react-dom` modules from within the `node_modules` in the current directory;

Go to the directories of both apps (`/start/Clients` and `/start/Stocks`), open a command prompt and run:

```cmd
npm install

npm start
```

This will install all necessary dependencies and will run the **Clients** app on port 3000 and the **Stocks** app on port 3001. The pages will reload whenever you make edits. You will also see any lint errors in the console.

### 1.2. Solution Files

Before you continue, take a look at the solution files. You are free to use the solution as you like - you can check after each section to see how it solves the problem, or you can use it as a reference point in case you get stuck.

Go to the `/rest-server` directory and start the REST Server (as described in the [REST Server](#setup-rest_server) chapter). 

Install all dependencies in `/react/solution/Clients`, `/react/solution/ClientDetails`, `/react/solution/Stocks`, `/react/solution/StockDetails` and start both apps by running the following commands: 

```cmd
npm install

npm start
```

Go to the `/react/solution` directory, open a command prompt and run the following commands to install the necessary dependencies and run the project:

```cmd
npm install

npm run start:workspace
```

You can now access the **Clients** app at `localhost:3000/clients`. You can open a workspace by clicking any of the listed clients. This will open a new workspace window which will contain the details of the selected client and the portfolio of stocks for that client. You can click on any individual stock to open it's details in a new window.

### 1.3. REST Server

Before starting with the project, go to the `/tutorials/rest-server` directory and start the REST server that will host the necessary data for the applications:

```cmd
npm install

npm start
```

This will launch the server at port 8080.

### 1.5. React Project Setup

This tutorial starts with two main applications. As the user requirements change, however, your **Glue42 Core** project will expand with more applications. Here you will learn how to create a new React application and set it up correctly in order to enable it to work with **Glue42 Core**. When you have to create and set up new apps later on in the tutorial, you can refer back to this chapter and follow the steps below to ensure that your app has been configured properly:

1. Go to the directory where you want your new app to be created, open a command prompt and run the following command replacing `my-app` with the name of your app:

```cmd
npx create-react-app my-app
```

2. Install the following dependencies in the root directory of your app:

```cmd
npm i --save @glue42/react-hooks@1.0.7 react-select@3.1.0 bootstrap@4.4.1 react-app-rewired@2.1.5 chroma-js@2.1.0
```

3. Edit the `package.json` file of your app:

- add a `homepage` property replacing `my-app` with the name of your app:

```json
"homepage": "/my-app/"
```

- change the `start`, `build` and `test` scripts to the following:

```json
"start": "react-app-rewired start --scripts-version react-scripts",
"build": "react-app-rewired build --scripts-version react-scripts",
"test": "react-app-rewired test --scripts-version react-scripts",
```

4. Create a `.env` file in the root directory of your app with the following settings:

```cmd
SKIP_PREFLIGHT_CHECK=true
PORT=3002
```

*Note that the `PORT` value must be different for each app in the project.*

5. Go to the root directory of one of the existing tutorial apps, copy the `config-overrides.js` file and paste it in the root directory of your app.

6. Start your app by running the following command from its root directory:

```cmd 
npm start
```

7. Create or edit the code for the new app by following the specific instructions in the respective chapters.

## 2. Initializing the Glue42 Web Library

Every Glue42 Core project must have a single central application called Main Application or Web Platform app. In a real-world scenario this would be an application used for discovering and listing available applications, Workspaces, handling notifications and much more. However, your goal now is to learn about all these aspects with as little complexity as possible. That's why the **Clients** app will serve as your Main application. The users will open the Clients app and from there they will be able to click on a client and see their stocks and so on.

Setting up a Main application is just as simple as calling a function. First, reference the Glue42 Web Platform script in the Clients app and then initialize the library. The Web Platform library handles the entire Glue42 environment, which is necessary for the Web Client apps to be able to connect to the Main application and to each other.

Now, you need to initialize the [**Glue42 Web**](../../../reference/core/latest/glue42%20web/index.html) library in each of the components. 

First, install the Glue42 React Hooks libraries for both applications:

```cmd
npm install --save @glue42/react-hooks
```

Second, install the Glue42 Web Platform **ONLY** in the **Clients** project:

```cmd
npm install --save @glue42/web-platform
```

Next, in the `index.js` file of the `Clients` application import the web-platform function with the following configuration:

```javascript
import { GlueProvider } from '@glue42/react-hooks';
import GlueWebPlatform from '@glue42/web-platform';

const settings  = {
    webPlatform: {
        factory: GlueWebPlatform
    }
}

ReactDOM.render(
    <GlueProvider settings={settings}>
        <Clients />
    </GlueProvider>,
    document.getElementById('root')
);
```

The `Clients` application is the main application of glue core. 

Now that you have a fully functional Main application, you need to initialize the Glue42 Web library in the rest of the applications. This will allow them to connect to the Clients app and communicate with each other. We only need to add the following code to initialize the `Stocks` application and the `StockDetails` application:

```javascript
import GlueWeb from "@glue42/web";
import { GlueProvider } from '@glue42/react-hooks';

const settings = {
    webPlatform: {
        factory: GlueWeb
    }
}

ReactDOM.render(
    <GlueProvider settings={settings}>
        <Stocks />
    </GlueProvider>,
    document.getElementById('root')
);
```

```javascript
import GlueWeb from "@glue42/web";
import { GlueProvider } from '@glue42/react-hooks';

const settings = {
    webPlatform: {
        factory: GlueWeb
    }
}

ReactDOM.render(
    <GlueProvider settings={settings}>
        <StockDetails />
    </GlueProvider>,
    document.getElementById('root')
);
```

In all three components (`Client.jsx`, `Stocks.jsx`, `StockDetails.jsx`), import `GlueContext` and `useGlue` from the `@glue42/react-hooks` library and the `useContext` React hook so that you can get the `glue` object from the context inside the components:

```javascript
import { useContext } from "react";
import { GlueContext, useGlue } from "@glue42/react-hooks";
```
Initialize the Glue42  Web library in all three components:

```javascript
// Clients.jsx
function Clients() {
    const glue = useContext(GlueContext);
};

// Stocks.jsx
function Stocks() {
    const glue = useContext(GlueContext);
};

// StockDetails.jsx
function StockDetails() {
    const glue = useContext(GlueContext);
};
```

The following JSX code will allow the components to show whether the Glue42 framework is available or not. Add the code in all three components and place it in the `return` statement inside the `<div className="container-fluid">` element:

```javascript
return (
    <div className="container-fluid">
        <div className="row">
            <div className="col-md-2">
                {!glue && (
                <span id="glueSpan" className="badge badge-warning">
                    Glue42 is unavailable
                </span>
                )}
                {glue && (
                <span id="glueSpan" className="badge badge-success">
                    Glue42 is available
                </span>
                )}
            </div>
            <div className="col-md-8">
                <h1 className="text-center">Clients</h1>
            </div>
        </div>
        ...
    </div>
);
```

You should now be able to see a small green label at the top left corner of your apps with the text "Glue42 is available".

## 3. Window Management

Now, you will extend the **Stocks** and **Stock Details** apps with new functionalities using the [**Window Management API**](../../../reference/core/latest/windows/index.html). When the user clicks on a stock in the **Stocks** app, the **Stock Details** app will open in a new window with specific dimensions. Also, the selected stock will be passed from from the **Stocks** app to the **Stock Details** app using the window context.

### 3.1. Opening Windows at Runtime

First, go to the `glue.js` file of the **Stocks** app and define a function that will open the **Stock Details** app in a new window. Use the `glue.windows.open()` method and pass a name and a URL for the new window. The name must be unique.

```javascript
let windowId = 0;

export const openStockDetails = (glue) => (symbol) => {
    const name = `StockDetailsReact${++windowId}`;
    const URL = `http://localhost:3002/`;

    // Opening a new window by providing a name and a URL.
    glue.windows.open(name, URL);
};
```

Now import `openStockDetails` in `Stocks.jsx` and pass it to the `onClick` handler of the `<tr>` element like this:

```javascript
import { openStockDetails } from './glue';

function Stocks() {
    ...
    const showStockDetails = useGlue(openStockDetails);
    ...
    return (
        ...
        {portfolio.map(({ RIC, Description, Bid, Ask, ...rest }) => (
            <tr
                key={RIC}
                onClick={() => showStockDetails({ RIC, Description, Bid, Ask, ...rest })}
            >
                <td>{RIC}</td>
                <td>{Description}</td>
                <td className="text-right">{Bid}</td>
                <td className="text-right">{Ask}</td>
            </tr>
        ))}
        ...
    )
}
```

Second, go to the `glue.js` file of the **Clients** app and define a function that will open the **Stocks** app in a new window. This call should a bit different in the sense that, we don't want a new window every time a client is clicked, instead we want to have no more than 1 Stocks window open at a time. That's why in addition to opening a window like we did above, we also need to check if such a window exists and if it does, then we do nothing. Your solution should look like this:

```javascript
export const openStocks = (glue) => (symbol) => {
    const URL = "http://localhost:3001/";
    const windowName = `Stocks`;

    const stockWindowAvailable = glue.windows.list().find((w) => w.name === windowName);

    if (!stockWindowAvailable) {
        glue.windows.open(windowName, URL).catch(console.error);
    }
}
```

Now import `openStocks` in `Clients.jsx` and pass it to the `onClick` handler of the `<tr>` element in the table:

```javascript
import { openStocks } from './glue';

function Clients() {
    ...
    const onClickClients = useGlue(openStocks);
    ...
    return (
        ...
        <tbody>
            {clients.map(({ name, pId, gId, accountManager }) => (
                <tr key={pId}
                    onClick={() => {
                        onClickStocks();
                    }}
                >
                    <td>{name}</td>
                    <td>{pId}</td>
                    <td>{gId}</td>
                    <td>{accountManager}</td>
                </tr>
            ))}
        </tbody>
        ...
    )
}
```

You should be able to click on a client, this should open the `Stocks` application that lists all the applications. When you click on a `Stock`, you should be able to see all the details of the given stock.

### 3.2. Window Settings

Next, pass an object with settings for the new window as a third parameter. Define the position (`top`, `left`) and the size (`width`, `height`) of the new window:

```javascript
export const openStockDetails = (glue) => (symbol) => {
    const name = `StockDetailsReact${++windowId}`;
    const URL = `http://localhost:3002/`;

    // Optional object with settings for the new window.
    const windowSettings = {
        top: 100,
        left: 100,
        width: 660,
        height: 660
    };

    glue.windows.open(name, URL, windowSettings);
};
```

### 3.3. Window Context

Every Glue42 Window has its own `context` property (its value can be any object) which can be defined when opening the window and can be updated later. You will pass the stock selected from the **Stocks** app as a window context for the new **Stock Details** window:

```javascript
export const openStockDetails = (glue) => (symbol) => {
    const name = `StockDetailsReact${++windowId}`;
    const URL = `http://localhost:3002/`;
    const windowSettings = {
        top: 100,
        left: 100,
        width: 660,
        height: 660,
        // Pass the `symbol` as a context for the new window.
        context: { symbol }
    };

    glue.windows.open(name, URL, windowSettings);
};
```

Next, you also have to define a function that will get the **Stock Details** app will use to get the context:

```javascript
export const getMyWindowContext = setWindowContext => glue => {
    const myWindow = glue.windows.my();
    myWindow.getContext()
        .then(context => {
            setWindowContext({ symbol: context.symbol });
        })
}
```

Now, go to the **Stocks** app and comment out or delete the existing handler for showing stock details. Consume the `openStockDetails()` function with the help of the `useGlue()` hook:

```javascript
import { openStockDetails } from "./glue";

function Stocks() {
    const showStockDetails = useGlue(openStockDetails);
};
```

In the `return` statement, update the event handler for each instrument row in the stocks table by replacing the existing `onClick` property:

```javascript
<tbody>
    {portfolio.map(({ RIC, Description, Bid, Ask, ...rest }) => (
        <tr onClick={() => showStockDetails({ RIC, Description, Bid, Ask, ...rest })} key={RIC}>
            <td>{RIC}</td>
            <td>{Description}</td>
            <td className="text-right">{Bid}</td>
            <td className="text-right">{Ask}</td>
        </tr>
    ))}
</tbody>
```

Finally, go to the **Stock Details** app to get the window context. Pass the `getMyWindowContext()` function to the `useGlue()` hook to get the window context:

```javascript
import { getMyWindowContext } from "./glue";

function StockDetails() {
    const [windowContext, setWindowContext] = useState({});

    // Get the window context.
    useGlue(getMyWindowContext(setWindowContext));
    
    // Extract the selected stock from the window context.
    const {
        symbol: { RIC, BPOD, Bloomberg, Description, Exchange, Venues, Bid, Ask } = {}
    } = windowContext || {};
};
```

Now, when you click on a stock in the **Stocks** app, the **Stock Details** app will open in a new window displaying information about the selected stock.

## 4. Interop

In this section you will use some of the functionalities provided by the **Glue42 Core** [**Interop API**](../../../reference/core/latest/interop/index.html).

### 4.1. Method Registration

When a user clicks on a client, the **Stocks** app should show only the stocks owned by this client. You can achieve this by registering an Interop method in the **Stocks** app which, when invoked, will receive the portfolio of the selected client and re-render the stocks table. Also, the **Stocks** app will create an Interop stream to which the new stock prices will be pushed. The **Stocks** and **Stock Details** apps will subscribe to the stream to get notified when new prices have been generated.

Define a callback for registering an Interop method in the `glue.js` file of the **Stocks** app:

```javascript
import { SET_CLIENT_METHOD } from "./constants";

export const registerSetClientMethod = (setClient) => (glue) => {
    // Register an Interop method by providing a name and a handler.
    glue.interop.register(SET_CLIENT_METHOD, setClient);
};
```
Import the callback in the `Stocks.jsx` component and use the `useGlue()` hook  to register the Interop method by passing the `setClient()` method from the `useState()` hook. The `useGlue()` hook will internally invoke the callback and will pass the `glue` object as an argument.

```javascript
import { useState } from "react";
import { registerSetClientMethod } from "./glue";

function Stocks() {
    const [{ clientId, clientName }, setClient] = useState({});
    useGlue(registerSetClientMethod(setClient));
};
```

Modify the `fetchPortfolio()` function inside the existing `useEffect()` hook to fetch the selected client portfolio. Pass `clientId` as a `useEffect()` dependency, so that `fetchPortfolio()` will be called whenever a new client is selected and the component is re-rendered:

```javascript
useEffect(() => {
    const fetchPortfolio = async () => {
        try {
            const url = `http://localhost:8080${clientId ? `/api/portfolio/${clientId}` : "/api/portfolio"}`;
            const response = await fetch(url, REQUEST_OPTIONS);
            const portfolio = await response.json();
            setPortfolio(portfolio);
        } catch (error) {
            console.error(error);
        };
    };
    fetchPortfolio();
}, [clientId]);
```

Finally, add an element to show the client name and ID above the stocks table in the `return` statement of the `Stocks` component.

```javascript
{clientId && (
    <h2 className="p-3">
        Client {clientName} - {clientId}
    </h2>
)}
```

### 4.2. Method Discovery and Invocation

Now, you need to invoke the registered Interop method from the **Clients** app every time the user clicks a client row in the clients table. Again, you will use the `useGlue()` hook to compose a handler which will invoke the Interop method. Before calling the method, you will also check if the method is has been registered (i.e., whether the **Stock** app is running).

In the `glue.js` file of the **Clients** app define a callback that will invoke the Interop method:

```javascript
import { SET_CLIENT_METHOD } from "./constants";

export const setClientPortfolioInterop = (glue) => ({ clientId, clientName }) => {
    // Check whether the method exists.
    const isMethodRegistered = glue.interop
        .methods()
        .some(({ name }) => name === SET_CLIENT_METHOD.name);
    if (isMethodRegistered) {
        // Invoke an Interop method by name and provide arguments for the invocation.
        glue.interop.invoke(SET_CLIENT_METHOD.name, { clientId, clientName });
    };
};
```

Import the callback in the `Clients.jsx` component and pass it to the `useGlue()` hook to define an `onClick()` handler function that you will attach to every client table row:

```javascript
import { setClientPortfolioInterop } from "./glue";

function Clients() {
    const onClickClients = useGlue(setClientPortfolioInterop);
};
```

In the `return` statement, attach the `onClick()` handler to every client row:

```javascript
<tbody>
    {clients.map(({ name, pId, gId, accountManager, portfolio }) => (
        <tr
            key={pId}
            onClick={() => {
                onClickStocks();
                onClickClients({ clientId: gId, clientName: name });
            }}
        >
            <td>{name}</td>
            <td>{pId}</td>
            <td>{gId}</td>
            <td>{accountManager}</td>
        </tr>
    ))}
</tbody>
```

Now when you click on a client in the **Clients** app, the **Stocks** app should display only the stocks that are in the portfolio of the selected client.

### 4.3. Creating Streams and Publishing Data

Now, you will create an Interop stream from the **Stocks** app to which new stock prices will be published at a set interval. The **Stocks** and the **Stock Details** apps will subscribe to that stream to show real time stock price updates. The prices will be generated by the predefined `publishInstrumentPrice()` function in the `glue.js` file of the **Stocks** app.

First, go to the `glue.js` file of the **Stocks** app and define a callback that will create the Interop stream. The `glue.interop.createStream()` method returns a `Stream` object which will be passed to the `publishInstrumentPrice()` handler:

```javascript
import { SET_PRICES_STREAM } from "./constants";

export const createInstrumentStream = async (glue) => {
    const stream = await glue.interop.createStream(SET_PRICES_STREAM);
    publishInstrumentPrice(stream);
};
```

Next, you have to modify the `publishInstrumentPrice()` callback to use the `push()` method of the `Stream` object to push the generated prices to the stream:

```javascript
export const publishInstrumentPrice = (stream) => {
    setInterval(() => {
        const stocks = {
            ...
        };

        // Push the stock prices to the stream.
        stream.push(stocks);
    }, 1500);
};
```

Finally, go to the `Stocks.jsx` component and create the stream with the `useGlue()` hook:

```javascript
import { useGlue } from "@glue42/react-hooks";
import { createInstrumentStream } from "./glue";

function Stocks() {
    useGlue(createInstrumentStream);
};
```

### 4.4. Stream Subscription

To consume the data from the created Interop stream, you have to create stream subscriptions in the **Stocks** and the **Stock Details** apps.

Go to the `glue.js` file of the **Stocks** app to define a callback that will create a stream subscription. This callback will receive as parameters a `handler` function responsible for updating the stock prices in the component context, and a stock `symbol`, which may be an array of stocks or a single stock depending on whether the callback has been invoked by the **Stocks** or the **Stock Details** app:

```javascript
// paste the function in both Stocks.jsx and StockDetails.jsx
export const subscribeForInstrumentStream = (handler) => async (glue, symbol) => {
    if (symbol) {
        // Create a stream subscription.
        const subscription = await glue.interop.subscribe(SET_PRICES_STREAM);
        const handleUpdates = ({ data: stocks }) => {
            if (stocks[symbol]) {
                handler(stocks[symbol]);
            } else if (Array.isArray(symbol)) {
                handler(stocks);
            };
        };
        // Specify a handler for new data.
        subscription.onData(handleUpdates);
        // Specify a handler if the subscription fails.
        subscription.onFailed(console.log);

        return subscription;
    }
};
```

Go to the `Stocks.jsx` component and create a stream subscription. The stream used in the tutorial publishes all possible stock prices and it is not necessary to close and renew the subscription when a new client has been selected. However, in a real project scenario, you will have to do exactly that. That is why, this is reflected in the code below. You have to pass the `portfolio` as a dependency of the `useGlue()` hook to trigger a new subscription every time the `portfolio` has been updated:

```javascript
import { subscribeForInstrumentStream } from "./glue";

function Stocks() {
    ...
    // The prices will be updated when new data is received from the stream.
    const [prices, setPrices] = useState({});
    // Create a stream subscription that will be renewed every time the `portfolio` changes.
    const subscription = useGlue(
        (glue, portfolio) => {
            if (portfolio.length > 0) {
                return subscribeForInstrumentStream(setPrices)(glue, portfolio);
            }
        },
        [portfolio]
    );

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                // Close the existing subscription when a new client has been selected.
                subscription &&
                typeof subscription.close === "function" &&
                subscription.close();

                const url = `http://localhost:8080${clientId ? `/api/portfolio/${clientId}` : "/api/portfolio"}`;
                const response = await fetch(url, REQUEST_OPTIONS);
                const portfolio = await response.json();
                setPortfolio(portfolio);
            } catch (error) {
                console.error(error);
            };
        };
        fetchPortfolio();
    }, [clientId]);
    ...
};
```

Update the code for displaying the `Ask` and `Bid` prices by taking their values from `prices` variable that is updated when new data is received from the stream:

```javascript
return (
    ...
        <tbody>
            {portfolio.map(({ RIC, Description, Bid, Ask, ...rest }) => (
                <tr
                    onClick={() => showStockDetails({ RIC, Description, Bid, Ask, ...rest })}
                    key={RIC}
                >
                    <td>{RIC}</td>
                    <td>{Description && Description.toUpperCase()}</td>
                    <td className="text-right">
                        {prices[RIC] ? prices[RIC].Bid : Bid}
                    </td>
                    <td className="text-right">
                        {prices[RIC] ? prices[RIC].Ask : Ask}
                    </td>
                </tr>
            ))}
        </tbody>
    ...
);
```

Now you should see the stock prices (last 2 columns) update at regular intervals.

Finally, extract `Bid` and `Ask` to **Stock Details**' state (`setPrices`) and create a stream subscription there as well by passing the `setPrices` method as a handler for the new stream data and the `RIC` to target the stock for which to get the prices. 

```javascript
import { subscribeForInstrumentStream } from "./glue";

function StockDetails() {
    ...
    const {
        symbol: { RIC, BPOD, Bloomberg, Description, Exchange, Venues } = {}
    } = windowContext || {};

    const [{ Bid, Ask }, setPrices] = useState({ Bid: windowContext.Bid, Ask: windowContext.Ask});

    useGlue(subscribeForInstrumentStream(setPrices), [RIC]);    
    ...
};
```

You can now observe that **Stock Details** also displays a new value for the `Bid` and `Ask` prices at regular intervals.

## 5. Shared Contexts

This section will show you how to update context objects and subscribe for context updates using the [**Shared Contexts API**](../../../reference/core/latest/shared%20contexts/index.html). You will extend the **Clients** app to update a context with information about the selected client, instead of using the Interop API to invoke a method. The **Stocks** app, instead of registering an Interop method, will subscribe for updates to the same context object to display the relevant client portfolio. You will add a "Show All" button to the **Stocks** app that will clear the context value in order to show information about all stocks. The **Stock Details** app will also subscribe for updates to this context in order to show whether the selected client has the selected stock in their portfolio.

### 5.1. Updating a Context

First, go to the `glue.js` file of the **Clients** and **Stocks** apps and define a function for updating the shared context object:

```javascript
import { SHARED_CONTEXT_NAME } from "./constants";

export const setClientPortfolioSharedContext = (glue) => (
    {
        clientId = "",
        clientName = "",
        portfolio = ""
    }
) => {
    glue.contexts.update(SHARED_CONTEXT_NAME, {
        clientId,
        clientName,
        portfolio
    });
};
```

Go to the **Clients** app and replace the `setClientPortfolioInterop()` handler for selecting a client with the `setClientPortfolioSharedContext()` one. Pass `portfolio` to `onClick` when calling it.

```javascript
import { setClientPortfolioSharedContext } from "./glue";

function Clients() {
    ...
    // const onClickClients = useGlue(setClientPortfolioInterop);
    const onClickClients = useGlue(setClientPortfolioSharedContext);
    ...

    return (
        ...
        {clients.map(({ name, pId, gId, accountManager, portfolio }) => (
            <tr
                key={pId}
                onClick={() => onClick({ clientId: gId, clientName: name, portfolio })}
            >
            ...
        ))}
        ...
    );
  }
```

Go to the **Stocks** app and define a handler for updating the shared context with the `useGlue()` hook. Also, add a "Show All" button in the `return` statement of the component that will invoke the handler on button click:

```javascript
import { setClientPortfolioSharedContext } from "./glue";

function Stocks() {
    ...
    const updateClientContext = useGlue(setClientPortfolioSharedContext);
    ...
    return (
        <div className="container-fluid">
        ...
            <button
                type="button"
                className="mb-3 btn btn-primary"
                onClick={() => updateClientContext({})}
            >
                Show All
            </button>
        ...
        </div>
    );
};
```

### 5.2. Subscribing for Context Updates

You have to subscribe the **Stocks** and **Stock Details** apps for updates to the same context object in order to update them accordingly when the user selects a new client.

First, go to the `glue.js` file of the **Stocks** and **Stock Details** applications and define a function for subscribing to the context. Use the `glue.contexts.subscribe()` method:

```javascript
import { SHARED_CONTEXT_NAME } from './constants';

export const subscribeForSharedContext = (handler) => (glue) => {
    // Subscribing for the shared context by 
    // providing a context name and a handler for context updates.
    glue.contexts.subscribe(SHARED_CONTEXT_NAME, handler);
};
```

Go to the `Stocks.jsx` component and replace the `registerSetClientMethod()` handler with the `subscribeForSharedContext()` one:

```javascript
import { subscribeForSharedContext } from "./glue";

function Stocks() {
    ...
    useGlue(subscribeForSharedContext(setClient));
    ...
};
```

Finally, go to the `StockDetails.jsx` component and also subscribe for updates to the shared context. Add an element in the `return` statement that will display conditionally depending on whether the client has the selected stock in their portfolio. You will need to add the client information (`clientId`, `clientName`, `portfolio`) to the component state to be able to display data about the currently selected client and use the `portfolio` to determine whether the client has the selected stock in their portfolio. 

```javascript
import { subscribeForSharedContext } from "./glue";

function StockDetails() {
    ...
    const [{ clientId, clientName, portfolio }, setClient] = useState({});
    ...
    useGlue(subscribeForSharedContext(setClient));

    return (
        <div className="container-fluid">
        ...
            <div className="row">
                {clientId && (
                <>
                    <h2 className="p-3">
                    Client {clientName} - {clientId}{" "}
                    </h2>
                    {RIC && portfolio.length && !portfolio.includes(RIC) && (
                        <h4 className="p-3">
                            The client does not have this stock in their portfolio.
                        </h4>
                    )}
                </>
                )}
            ...
            </div>
        ...
        </div>
    );
};
```

## 6. Channels

Currently, no matter how many instances of the **Stocks** app are running, they are all listening for updates to the same context and therefore all show information about the same selected client. Here, you will use the [Channels API](../../../reference/core/latest/channels/index.html) to allow each instance of the **Stocks** app to subscribe for updates to the context of a selected channel. The different channels are color coded and the user will be able to select a channel from a Channel Selector UI. The **Clients** app will update the context of the currently selected channel when the user clicks on a client.

### 6.1. Channels Configuration

Up until this moment, you have called the GlueWebPlatform factory function with no arguments, because you didn't need to to define anything. From now on this changes, Clients is the Main applications of the project, therefore it is it's responsibility to initiate and maintain all channels. To achieve all of this, we need to define an configuration object and pass it to the GlueWebPlatform factory function in the `index.js` of the `Clients` application:

```javascript
// index.js of Clients app
const channels = {
    definitions: [
        {
            name: "Red",
            meta: {
                color: "red"
            }
        },
        {
            name: "Green",
            meta: {
                color: "green"
            }
        },
        {
            name: "Blue",
            meta: {
                color: "#66ABFF"
            }
        },
        {
            name: "Pink",
            meta: {
                color: "#F328BB"
            }
        },
        {
            name: "Yellow",
            meta: {
                color: "#FFE733"
            }
        },
        {
            name: "Dark Yellow",
            meta: {
                color: "#b09b00"
            }
        },
        {
            name: "Orange",
            meta: {
                color: "#fa5a28"
            }
        },
        {
            name: "Purple",
            meta: {
                color: "#c873ff"
            }
        },
        {
            name: "Lime",
            meta: {
                color: "#8af59e"
            }
        },
        {
            name: "Cyan",
            meta: {
                color: "#80f3ff"
            }
        }
    ]
}

const config = {
    channels
};

const settings  = {
    webPlatform: {
        factory: GlueWebPlatform,
        config
    }
}

ReactDOM.render(
    <GlueProvider settings={settings}>
        <Clients />
    </GlueProvider>,
    document.getElementById('root')
);
```

The `GlueProvider` will initialize internally the [**Glue42 Web**](../../../reference/core/latest/glue42%20web/index.html) library and enable the Channels API.

### 6.2. Channel Selector Widget

The users have to be able to navigate through the channels for which they will need some sort of user interface. You can create your own channel selector widget by using the Channels API, but for the purpose of the tutorial there is a `ChannelSelectorWidget` component provided. To add it to the **Stocks** and **Clients** apps, follow these steps:

1. Import the Channel Selector widget in the `Clients.jsx` and `Stocks.jsx` components:

```javascript
import ChannelSelectorWidget from "./ChannelSelectorWidget";
```

2. To use the use the new component, you have to pass two props to it:
- `channelNamesAndColors` - the names and colors of all available channels; 
- `onChannelSelected` - handler that will be called when the channel changes; 

Go to the `glue.js` file of the **Clients** and **Stocks** apps and define the following functions:

```javascript
// This will be used to signify that the app is not connected to any channel.
import { NO_CHANNEL_VALUE } from "./constants";

// Returns all names and color codes of the avaialbale channels.
export const getChannelNamesAndColors = async (glue) => {
    // Getting a list of all channel contexts.
    const channelContexts = await glue.channels.list();

    // Extracting only the names and colors of the channels.
    const channelNamesAndColors = channelContexts.map((channelContext) => {
        const channelInfo = {
            name: channelContext.name,
            color: channelContext.meta.color
        };

        return channelInfo;
    });

    return channelNamesAndColors;
};

// This function will join a given channel.
export const joinChannel = (glue) => ({ value: channelName }) => {
    if (channelName === NO_CHANNEL_VALUE) {
        // Checking for the current channel.
        if (glue.channels.my()) {
            // Leaving a channel.
            glue.channels.leave();
        }
    } else {
        // Joining a channel.
        glue.channels.join(channelName);
    };
};
```

3. Now you need to setup the `ChannelSelectorWidget` in both apps. 

Go to the **Clients** app to set up the channels functionalities.

```javascript
import {
    getChannelNamesAndColors,
    joinChannel
} from "./glue";

function Clients() {
    ...
    const channelNamesAndColors = useGlue(getChannelNamesAndColors);
    const onChannelSelected = useGlue(joinChannel);
    ...
};
```

You can now create the `ChannelWidgetSelector` component in the `return` statement. Pass the `channelNamesAndColors` and `onChannelSelected` as props to it:

```javascript
return (
    <div className="container-fluid">
        <div className="row">
            ...
            <div className="col-md-10">
                <h1 className="text-center">Clients</h1>
            </div>
            <div className="col-md-2 align-self-center">
                <ChannelSelectorWidget
                    channelNamesAndColors={channelNamesAndColors}
                    onChannelSelected={onChannelSelected}
                />
            </div>
            ...
        </div>
        ...
    </div>
);
```

4. Go to the **Stocks** app to set up the channels functionalities. Create a `setDefaultClient()` callback for handling the default state where no client has been selected.

```javascript
import {
    getChannelNamesAndColors,
    joinChannel
} from "./glue";

function Stocks() {
    ...
    const channelNamesAndColors = useGlue(getChannelNamesAndColors);
    const onChannelSelected = useGlue(joinChannel);
    const setDefaultClient = () => setClient({ clientId: "", clientName: "" });
    ...
};
```

You can now create the `ChannelWidgetSelector` component in the `return` statement. Pass the `channelNamesAndColors` and `onChannelSelected` as props to it: 

```javascript
return (
    <div className="container-fluid">
        <div className="row">
            ...
            <div className="col-md-10">
                <h1 className="text-center">Clients</h1>
            </div>
            <div className="col-md-2 align-self-center">
                <ChannelSelectorWidget
                    channelNamesAndColors={channelNamesAndColors}
                    onChannelSelected={onChannelSelected}
                    onDefaultChannelSelected={setDefaultClient}
                />
            </div>
            ...
        </div>
        ...
    </div>
);
```

Finally, add a `key` prop to the `ChannelSelectorWidget` component. It will hold the value of the `channelWidgetState` state variable which will be used to clear the state of the `ChannelSelectorWidget` when the user clicks the "Show All" button to clear the currently selected client. Update the code of the `onClick` handler in the button:

```javascript
function Stocks() {
    ...
    const [channelWidgetState, setChannelWidgetState] = useState(false);
    ...

    return (
        ...
        <button
            type="button"
            className="mb-3 btn btn-primary"
            onClick={() => {
                setChannelWidgetState(!channelWidgetState);
                setDefaultClient();
            }}
        >
            Show All
        </button>
        ...
    );
};
```

### 6.3. Publishing and Subscribing

Next, you need to enable the **Clients** app to publish updates to the current channel context and the **Stocks** app to subscribe for these updates.

Go to the `glue.js` file of the **Clients** app and define a function that will publish updates to the current channel: 

```javascript
export const setClientPortfolioChannels = (glue) => (
    {
        clientId = "",
        clientName = ""
    }
) => {
    // Checking for the current channel.
    if (glue.channels.my()) {
        // Publishing data to the channel.
        glue.channels.publish({ clientId, clientName });
    };
};
```

Go the `Clients.jsx` component to use this function to update the current channel.

*Note: Do not comment out `setClientPortfolioSharedContext()` code. The **Stock Details** app still uses the shared context to get the client information. Just rename the variable holding the click handler from `onClick` to `onClickContext` and use both handlers.*

```javascript
import { setClientPortfolioChannels } from "./glue";

function Clients() {
    ...
    const onClickClients = useGlue(setClientPortfolioSharedContext);
    const onClickContext = useGlue(setClientPortfolioChannels);
    ...

    return (
        ...
        <tr
            key={pId}
            onClick={() => {
                    // Use both handlers.
                    onClickStocks();
                    onClickClients({ clientId: gId, clientName: name, portfolio });
                    onClickContext({ clientId: gId, clientName: name });
                }
            }
        >
        ...
    );
};
```

Next, go to the `glue.js` file of the **Stocks** app and define a function that will subscribe for channel updates:

```javascript
export const subscribeForChannels = (handler) => (glue) => {
    // Subscribing for updates to the current channel.
    glue.channels.subscribe(handler);
};
```

Go to the `Stocks.jsx` component and comment out or delete the code that uses the Shared Contexts API to listen for updates to the shared context. Instead, subscribe for channel updates:

```javascript
import { subscribeForChannels } from "./glue";

function Stocks() {
    ...
        // useGlue(registerSetClientMethod(setClient));
    // useGlue(subscribeForSharedContext(setClient));
    useGlue(subscribeForChannels(setClient));
    ...
};
```
Lastly, go to the `glue.js` file of the **Clients** application and remove the check for more than one open **Stocks** application window. You must also generate a unique window name for each of the opened windows. This is done here by an incrementing variable:

```javascript
let windowId = 0;

export const openStocks = (glue) => (symbol) => {
    const URL = "http://localhost:3001/";
    const windowName = `Stocks${++windowId}`;

    // const stockWindowAvailable = glue.windows.list().find((w) => w.name === windowName);

    // if (!stockWindowAvailable) {
        glue.windows.open(windowName, URL).catch(console.error);
    // }
}
```

Now, you can open multiple instances of the **Stocks** app and keep them on different colored channels. The **Clients** app will update only the context of the channel it is currently on and only the instance of the **Stocks** app that is on the same channel will update accordingly.

## 7. Application Management

Up until now the **Stocks** app had to use the Window Management API to open the **Stock Details** application when the user clicks on a stock. This works fine for small projects, but does not scale well for larger ones, because this way each app has to know all details (URL, start position, initial context, etc.) about every application it needs to start. In this chapter you will replace the Window Management API with the [Application Management API](../../../reference/core/latest/appmanager/index.html) which will allow you to predefine the applications in the [Glue42 Environment](../../../developers/core-concepts/environment/overview/index.html).

### 7.1. Application Configuration

To take advantage of the Application Management API, you need to define the configurations for your applications. To do this, (similarly to Channels) you need to define an applications property, containing all of the required definitions, in the GlueWebPlatform config inside Clients.

```javascript
// index.js in Clients application

// previous code
const applications = {
    local: [
        {
            name: "Clients",
            details: {
                url: "http://localhost:3000/clients"
            }
        },
        {
            name: "Stocks",
            details: {
                url: "http://localhost:3001/stocks",
                left: 0,
                top: 0,
                width: 860,
                height: 600
            }
        },
        {
            name: "Stock Details",
            details: {
                url: "http://localhost:3002/details",
                left: 100,
                top: 100,
                width: 400,
                height: 400
            }
        },
        {
            name: "Client Details",
            details: {
                url: "http://localhost:3003/client-details"
            }
        }
    ]
}

const config = {
    channels,
    applications
};

const settings  = {
    webPlatform: {
        factory: GlueWebPlatform,
        config
    }
}

ReactDOM.render(
    <GlueProvider settings={settings}>
        <Clients />
    </GlueProvider>,
    document.getElementById('root')
);

```

#### Enable the Application Management API

Since we have updated the Main Application (the Clients application), we have enabled the application management api in all of the remaining applications

The application name is used by the platform to map it to the respective local/remote application definition that is then accessible through the `application` property of [`glue.appManager.myInstance`](../../../reference/core/latest/appmanager/index.html#!API-myInstance). For the mapping to work, it is important that the application name provided when initializing the Glue42 Web library is the same as the application name defined in the local/remote application configuration.

### 7.2. Starting Applications

Go to the `glue.js` file of the **Stock** app and edit the `openStockDetails()` function. Use the [`glue.appManager.application()`](../../../reference/core/latest/appmanager/index.html#!API-application) method to get the **Stock Details** app and call the `start()` method on the application object to start it. The `start()` method also accepts a context object as a first parameter that will be passed as context to the started application instance:

```javascript
export const openStockDetails = glue => symbol => {
    glue.appManager.application("Stock Details").start({ symbol });
};
```

Go to the `glue.js` files of the **Stocks** and the **Stock Details** apps and edit the `getMyWindowContext()` function to get the window context using the Application Management API:

```javascript
// StockDetails.jsx
export const getMyWindowContext = setWindowContext => glue => {
    const myWindow = glue.appManager.myInstance;
    myWindow.getContext()
        .then(context => {
            setWindowContext({ symbol: context.symbol });
        })
};
```

```javascript
// Stocks.jsx
export const getMyWindowContext = setWindowContext => glue => {
    const myWindow = glue.appManager.myInstance;
    myWindow.getContext()
        .then(context => {
            setWindowContext({ channel: context.channel });
        })
};
```

Everything should work as before, the difference being that now the apps are using the Application Management API instead of the Window Management API.

### 7.3. Application Instances

Next, you will use the Application Management API to add new functionality to the **Clients** application. When the user selects a client, you can check whether there is a running instance of the **Stocks** app, and if there isn't one, you will start the **Stocks** app. You will also pass the current channel as context to the started instance of the **Stocks** app. Each application object has an `instances` property that allows you to get the running instances of the application.

Go to the `glue.js` file of the **Clients** app and pass the current channel as context:

```javascript
export const startApp = glue => () => {
    const isStocksRunning = glue.appManager.application("Stocks").instances.length > 0;
    if (!isStocksRunning) {
        glue.channels.list().then(channels => {
            let channel = {};
            if (glue.channels.my()) {
                const channelDefinition = channels.find(channel => channel.name === glue.channels.my());
                channel = {
                    name: channelDefinition.name,
                    label: channelDefinition.name,
                    color: channelDefinition.meta.color
                };
            } else {
                channel = {
                    name: NO_CHANNEL_VALUE,
                    label: NO_CHANNEL_VALUE
                }
            }
            glue.appManager.application("Stocks").start({ channel });
        });
    }
}
```

*Note that the `ChannelSelectorWidget` wraps a React `Select` component and to use it as a controlled component (when you want to make the **Stocks** app automatically select a channel on startup), you must create a proper channel definition object using the values of the `name` and `meta.color` properties and pass it to the **Stocks** application.*

Import the `startApp()` function in the `Clients.jsx`, create a `startStocksApp()` callback and pass it to the `onClick` handler of the client row:

```javascript
import { startApp } from "./glue.js";

function Clients() {
    ...
    const startStocksApp = useGlue(startApp);
    ...

    return (
        ...
        <tbody>
            {clients.map(({ name, pId, gId, accountManager, portfolio }) => (
                <tr
                    key={pId}
                    onClick={() => {
                            // we do not need this anymore
                            // onClickStocks();
                            onClickClients({ clientId: gId, clientName: name, portfolio });
                            onClickContext({ clientId: gId, clientName: name });
                            startStocksApp();
                        }
                    }
                >
                    <td>{name}</td>
                    <td>{pId}</td>
                    <td>{gId}</td>
                    <td>{accountManager}</td>
                </tr>
            ))}
        </tbody>
        ...
    )
}
```

Go to the **Stocks** app and use the `getWindowContext()` function from the `glue.js` file to get the channel passed as window context by the **Clients** application. Import the `NO_CHANNEL_VALUE` constant from `constants.js` to handle the case when no channel is available in the window context:

```javascript
import { getMyWindowContext } from "./glue";
import { NO_CHANNEL_VALUE } from "./constants";

function Stocks() {
    ...
    const [currentChannel, setCurrentChannel] = useState({ value: NO_CHANNEL_VALUE, label: NO_CHANNEL_VALUE });
    useGlue(getMyWindowContext(setWindowContext));

    useEffect(() => {
        if (windowContext.channel) {
            setCurrentChannel(windowContext.channel);
            if (onChannelSelected) {
                onChannelSelected({ value: windowContext.channel.name });
            }
        } else {
            setCurrentChannel({ value: NO_CHANNEL_VALUE, label: NO_CHANNEL_VALUE });
        }
    }, [windowContext.channel, onChannelSelected]);
    ...
}
```

Add a `value` property to the `<ChannelSelectorWidget />` that will hold the `currentChannel` value. Add the `setCurentChannel()` function to the `onChannelSelected` property:

```javascript
function Stocks() {
    ...
    return (
        ...
        <div className="col-md-2 align-self-center">
            <ChannelSelectorWidget
                value={currentChannel}
                key={channelWidgetState}
                channelNamesAndColors={channelNamesAndColors}
                onChannelSelected={channel => {
                    onChannelSelected(channel);
                    setCurrentChannel(channel);
                }}
                onDefaultChannelSelected={channel => {
                    setDefaultClient();
                    onChannelSelected(channel);
                    setCurrentChannel({ value: NO_CHANNEL_VALUE, label: NO_CHANNEL_VALUE });
                }}
            />
        </div>
        ...
    )
}
```

The `onChannelSelected()` function manages the channel selection and the `setCurrentChannel()` function visualizes the current channel in the component.

## 8. Workspaces

The latest feedback from the users is that their desktops very quickly become cluttered with multiple floating windows. The **Glue42 Core** [Workspaces](../../../capabilities/windows/workspaces/index.html) feature solves exactly that problem.

The new requirement is that when a user clicks on a client in the Clients application, a new Workspace should open displaying detailed information about the selected client in one app and his stocks portfolio in another. When the user clicks on a stock, a third application should appear in the same Workspace displaying more details about the selected stock. You will create a **Client Details** application for displaying information about the selected client.

Go to the `.jsx` files of the **Clients** and **Stocks** apps and comment out all logic and imports related to Channels, introduced in a previous chapter. Instead, you will use Workspaces to allow the users to work with multiple clients at once and organize their desktop at the same time. Channels and Workspaces can, of course, be used together to provide extremely enhanced user experience, but in order to focus entirely on working with Workspaces, the Channels functionality will be ignored.

Use the [Workspaces API](../../../reference/core/latest/workspaces/index.html) documentation as a reference when working on this chapter.

### 8.1. Setup

All workspaces are contained in a specialized, standalone web application called "Workspaces Frame". It is outside the scope of this tutorial to cover building and customizing this applications, so you have a ready-to-go application located at /workspace. This application is already being hosted by the npm start script at `http://localhost:9300/`, so there is nothing you need to do.

#### Create the Client Details App

- Create a new React app named `ClientDetails` in the root directory of your **Glue42 Core** project following the instructions in [Chapter 1.5.](#1_setup-15_react_project_setup).

- Create a `ClientDetails.jsx` file in `/ClientDetails/src` and paste the following code:

```javascript
import React, { useState } from "react";

function ClientDetails() {
    const [client, setClient] = useState({});
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <span id="glueSpan" className="label label-warning">Glue42 is unavailable</span>
                </div>
                <div className="col-md-10">
                    <h1 className="text-center">Client Details</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <h3 id="clientStatus"></h3>
                </div>
            </div>
            <div className="row">
                <table id="clientsTable" className="table table-hover">
                    <tbody>
                        <tr>
                            <th>Full Name</th>
                            <td data-name>{client && client.clientName}</td>
                        </tr>
                        <tr>
                            <th>Address</th>
                            <td data-address>{client && client.address}</td>
                        </tr>
                        <tr>
                            <th>Phone Number</th>
                            <td data-phone>{client && client.contactNumbers}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td data-email>{client && client.email}</td>
                        </tr>
                        <tr>
                            <th>Account Manager</th>
                            <td data-manager>{client && client.accountManager}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ClientDetails;
```

- Go to the `index.js` file of the newly created **Client Details** app. Add all imports from the example below, remove the `App` import and replace the `<App />` component with `<ClientDetails />`:

```javascript
import GlueWeb from "@glue42/web";
import { GlueProvider } from "@glue42/react-hooks";
import "bootstrap/dist/css/bootstrap.css";
import ClientDetails from "./ClientDetails";

const settings  = {
  webPlatform: {
      factory: GlueWeb
  }
}

ReactDOM.render(
  <GlueProvider settings={settings}>
    <ClientDetails />
  </GlueProvider>,
  document.getElementById('root')
);
```

### 8.2. Workspace Layouts

Next, you need to build a Workspace layout which will be the blueprint of the Workspace that the **Clients** app will restore when the user clicks on a client. This layout should contain the **Client Details** and **Stocks** apps.

@orkspace layout can be restored by name using the [Workspaces API](../../../reference/core/latest/workspaces/index.html).

### 8.3. Initializing Workspaces

To be able to use Workspaces functionalities, you need to initialize the [Workspaces API](../../../reference/core/latest/workspaces/index.html) in the **Clients**, **Client Details** and **Stocks** apps. The **Stock Details** app will participate in the Workspace, but will not need to use any Workspaces functionality. Go to the root directories of the **Clients**, **Stocks** and **Client Details** apps and run the following command to install the Workspaces API:

```cmd
npm i --save @glue42/workspaces-api
```

Go to the `index.js` files of the **Clients**, **Client Details** and **Stocks** apps, import the `GlueWorkspaces` library and add `GlueWorkspaces` to the `libraries` array of the configuration object when initializing the Glue42 Web library.

In the `index.js` file of the **Clients** application add  the layouts initialization code:

```javascript
// Initializing the Workspaces API in the Clients app.
import GlueWorkspaces from "@glue42/workspaces-api";

const layouts = {
    mode: "idb",
    local: [
        {
            name: "example",
            type: "Workspace",
            metadata: {},
            components: [
                {
                    type: "Workspace",
                    state: {
                        children: [
                            {
                                type: "column",
                                children: [
                                    {
                                        type: "row",
                                        children: [
                                            {
                                                type: "group",
                                                children: [
                                                    {
                                                        type: "window",
                                                        config: {
                                                            appName: "Client Details",
                                                            title: "React App",
                                                            context: {}
                                                        }
                                                    }
                                                ],
                                                config: {}
                                            },
                                            {
                                                type: "column",
                                                children: [
                                                    {
                                                        type: "group",
                                                        children: [
                                                            {
                                                                type: "window",
                                                                config: {
                                                                    appName: "Stocks",
                                                                    title: "React App",
                                                                    context: {}
                                                                }
                                                            }
                                                        ],
                                                        config: {}
                                                    }
                                                ],
                                                config: {}
                                            }
                                        ],
                                        config: {}
                                    }
                                ],
                                config: {}
                            }
                        ],
                        config: {
                            name: "example",
                            title: "Untitled 1"
                        },
                        context: {}
                    }
                }
            ]
        }
    ]
}

const config = {
    glue: { libraries: [GlueWorkspaces] },
    workspaces: { src: "http://localhost:9300/" },
    channels,
    applications,
    layouts
};

const settings  = {
    webPlatform: {
        factory: GlueWebPlatform,
        config
    }
}

ReactDOM.render(
    <GlueProvider settings={settings}>
        <Clients />
    </GlueProvider>,
    document.getElementById('root')
);
```

```javascript
// Stocks.jsx
import GlueWorkspaces from '@glue42/workspaces-api';

const settings  = {
    webPlatform: {
        factory: GlueWeb,
        config: {
          libraries: [GlueWorkspaces]
        }
    }
  }

ReactDOM.render(
    <GlueProvider settings={settings}>
        <Stocks />
    </GlueProvider>,
    document.getElementById('root')
);
```

```javascript
// ClientDetails.jsx

import GlueWorkspaces from '@glue42/workspaces-api';

const settings  = {
  webPlatform: {
      factory: GlueWeb,
      config: {
        libraries: [GlueWorkspaces]
      }
  }
}

ReactDOM.render(
  <GlueProvider settings={settings}>
    <ClientDetails />
  </GlueProvider>,
  document.getElementById('root')
);
```

```javascript
// StockDetails.jsx
import GlueWeb from "@glue42/web";

const settings = {
    webPlatform: {
        factory: GlueWeb
    }
}

ReactDOM.render(
    <GlueProvider settings={settings}>
        <StockDetails />
    </GlueProvider>,
    document.getElementById('root')
);
```

### 8.4. Opening Workspaces

Next, you have to implement opening a new Workspace when the user clicks on a client in the **Clients** app. Go to the `clientClickedHandler` function in the **Clients** app, restore by name the Workspace layout you created earlier and pass the selected client as a starting context. The specified context will be attached as a window context to all windows participating in the Workspace. Go to the `index.js` file of the **Clients** app and add the following:

```javascript
export const startAppWithWorkspace = glue => client => {
    glue.workspaces.restoreWorkspace("client-space", { context: client });
}
```

Import the function in `Clients.jsx` and create a `openWorkspace()` callback to be passed to the `onClick` handler of the client row:

```javascript
import { startAppWithWorkspace } from "./glue";

function Clients() {
    ...
    const openWorkspace = useGlue(startAppWithWorkspace);
    ...
}
```

Delete the existing code in the `onClick` handler of the client row element and replace it with a call to `openWorkspace()`:

```javascript
...
    return (
        ...
            <tr
                key={pId}
                onClick={() => {
                        openWorkspace({ clientId: gId, clientName: name, accountManager, portfolio, ...rest });
                    }
                }
            >
                <td>{name}</td>
                <td>{pId}</td>
                <td>{gId}</td>
                <td>{accountManager}</td>
            </tr>
        ...
    );
...
```

If everything is correct, a new Workspace should now open every time you click a client.

### 8.5. Starting Context

The windows of the **Client Details** and **Stocks** apps participating in the new Workspace will have a starting context attached to them. You have to handle this starting context in order to display the relevant client data when the user selects a client from the **Clients** app.

To get the starting window context, you have to subscribe for updates to the context of the current window using the [Window Management API](../../../reference/core/latest/windows/index.html). When the window context has been updated, you have to handle the client data in the respective application and also set the Workspace title to the name of the selected client.

Create a `glue.js` in `/ClientDetails/src` and insert the following:

```javascript
export const setClientFromWorkspace = setClient => glue =>
    glue.workspaces.getMyWorkspace()
        .then(myWorkspace => {
            myWorkspace
                .onContextUpdated(context => {
                    if (context) {
                        setClient(context);
                        myWorkspace.setTitle(context.clientName);
                    }
                })
        });
```

Import the `setClientFromWorkspace()` function in `ClientDetails.jsx` and set it up using the `useGlue()` hook:

```javascript
import { setClientFromWorkspace } from "./glue";

function ClientDetails() {
    ...
    useGlue(setClientFromWorkspace(setClient));
    ...
}
```

Next, update the **Stocks** application to show the stocks of the currently selected client. Go to the `glue.js` file of the **Stocks** app and add the following:

```javascript
export const setClientFromWorkspace = setClient => glue => {
    glue.workspaces.getMyWorkspace()
        .then(myWorkspace => {
            myWorkspace
                .onContextUpdated(context => {
                    if (context) {
                        setClient(context);
                        myWorkspace.setTitle(context.clientName);
                    }
                })
        });
}
```

Import the `setClientFromWorkspace()` function in `ClientDetails.jsx` and set it up using the `useGlue()` hook:

```javascript
import { setClientFromWorkspace } from "./glue";

function Stocks() {
    ...
    useGlue(setClientFromWorkspace(setClient));
    ...
}
```

Now when you select a client in the **Clients** app, a new Workspace should open with the **Client Details** and **Stocks** apps showing the relevant client information.

### 8.6. Modifying Workspaces

Next, you have to make the **Stock Details** app appear in the same Workspace as a sibling of the **Stocks** app when the user clicks on a stock. You have to check whether the **Stock Details** app has already been added to the Workspace, and if not - add it and update its context with the selected stock, otherwise - only update its context.

*To achieve this functionality, you will have to manipulate a Workspace and its elements. It is recommended that you familiarize yourself with the Workspaces terminology to fully understand the concepts and steps below. You can use the available documentation about [Workspaces Concepts](../../../capabilities/windows/workspaces/index.html#workspaces_concepts), [Workspace Box Elements](../../../glue42-concepts/windows/workspaces/javascript/index.html#box_elements) and the [Workspaces API](../../../reference/core/latest/workspaces/index.html).*

The **Stocks** app is a [`WorkspaceWindow`](../../../reference/core/latest/workspaces/index.html#!WorkspaceWindow) that is the only child of a [`Group`](../../../reference/core/latest/workspaces/index.html#!Group) element. If you add the **Stock Details** app as a child to that `Group`, it will be added as a second tab window and the user will have to manually switch between both apps. The **Stock Details** has to be a sibling of the **Stocks** app, but both apps have to be visible within the same parent element. That is why, you have to add a new `Group` element as a sibling of the existing `Group` that contains the **Stocks** app, and then load the **Stock Details** app in it.

After the **Stocks Details** app has been opened in the Workspace as a [`WorkspaceWindow`](../../../reference/core/latest/workspaces/index.html#!WorkspaceWindow), you have to pass the selected stock as its context. To do that, get a reference to the underlying [Glue42 Window](../../../reference/core/latest/windows/index.html#!WebWindow) object of the **Stock Details** window using the [`getGdWindow()`](../../../reference/core/latest/workspaces/index.html#!WorkspaceWindow-getGdWindow) method of the [`WorkspaceWindow`](../../../reference/core/latest/workspaces/index.html#!WorkspaceWindow) instance and update its context with the [`updateContext()`](../../../reference/core/latest/windows/index.html#!WebWindow-updateContext) method.

Go to the `glue.js` file of the **Stocks** app and create the following function:

```javascript
export const openStockDetailsInWorkspace = glue => async stock => {
    // Reference to the Glue42 Window object of the Stock Details instance.
    let detailsGlue42Window;

    const myWorkspace = await glue.workspaces.getMyWorkspace();

    // Reference to the `WorkspaceWindow` object of the Stock Details instance.
    let detailsWorkspaceWindow = myWorkspace.getWindow(window => window.appName === "Stock Details");

    // Check whether the Stock Details has already been opened.
    if (detailsWorkspaceWindow) {
        detailsGlue42Window = detailsWorkspaceWindow.getGdWindow();
    } else {
        // Reference to the current window.
        const myId = glue.windows.my().id;
        // Reference to the immediate parent element of the Stocks window.
        const myImmediateParent = myWorkspace.getWindow(window => window.id === myId).parent;
        // Add a `Group` element as a sibling of the immediate parent of the Stocks window.
        const group = await myImmediateParent.parent.addGroup();

        // Open the Stock Details window in the newly created `Group` element.
        detailsWorkspaceWindow = await group.addWindow({ appName: "Stock Details" });
        await detailsWorkspaceWindow.forceLoad();
        detailsGlue42Window = detailsWorkspaceWindow.getGdWindow();
    }

    // Update the window context with the selected stock.
    detailsGlue42Window.updateContext({ stock });
}
```

*Note that [`forceLoad()`](../../../reference/core/latest/workspaces/index.html#!WorkspaceWindow-forceLoad) is used to make sure that the **Stock Details** app is loaded and a [Glue42 Window](../../../reference/core/latest/windows/index.html#!WebWindow) instance is available. This is necessary, because [`addWindow()`](../../../reference/core/latest/workspaces/index.html#!Group-addWindow) adds a new window to the [`Group`](../../../reference/core/latest/workspaces/index.html#!Group) (meaning that it exists as an element in the Workspace), but it does not guarantee that the content has loaded.*

Import the function in `Stocks.jsx`, comment out or delete the existing `onClick()` callback and replace it with the newly created `openStockDetailsInWorkspace()` function:

```javascript
import { openStockDetailsInWorkspace } from "./glue";

function Stocks() {
    ...
    const onClick = useGlue(openStockDetailsInWorkspace);
    ...
}
```

Go to the `glue.js` file of the **Stock Details** app and change the `getMyWindowContext()` function to the following:

```javascript
export const getMyWindowContext = setWindowContext => glue => {
    const myWindow = glue.windows.my();
    myWindow.getContext()
        .then(context => {
            setWindowContext({ symbol: context.stock });
        })
    myWindow.onContextUpdated(context => {
        if (context.stock) {
            setWindowContext({ symbol: context.stock });
        }
    })
}
```

Go to `StockDetails.jsx`, change the `windowContext` variable to a React hook state variable and set up `getMyWindowContext()` using the `useGlue()` hook:

```javascript
function StockDetails() {
    ...
    const [windowContext, setWindowContext] = useState({});
    ...
    useGlue(getMyWindowContext(setWindowContext));
    ...
}
```

## Congratulations

You have successfully completed the **Glue42 Core** React tutorial! See also the [JavaScript](../javascript/index.html) and [Angular](../angular/index.html) tutorials for **Glue42 Core**.
