import React, { useEffect, useState, useContext } from "react";
import { REQUEST_OPTIONS } from "./constants";
import { GlueContext, useGlue } from "@glue42/react-hooks";
import {
    createInstrumentStream,
    subscribeForInstrumentStream,
    setClientFromWorkspace,
    openStockDetailsInWorkspace
} from "./glue";

function Stocks() {
    const [portfolio, setPortfolio] = useState([]);
    const [{ clientId, clientName }, setClient] = useState({});
    const [prices, setPrices] = useState({});
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
    const glue = useContext(GlueContext);
    const showStockDetails = useGlue(openStockDetailsInWorkspace);
    useGlue(createInstrumentStream);
    const setDefaultClient = () => setClient({ clientId: "", clientName: "" });
    useGlue(setClientFromWorkspace(setClient));

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
                    <h1 id="title" className="text-center">
                        Stocks
                    </h1>
                </div>
                <div className="col-md-2 py-2">
                    <button
                        type="button"
                        className="mb-3 btn btn-primary"
                        onClick={() => {                     
                            setDefaultClient();
                        }}
                    >
                        Show All
                    </button>
                </div>
            </div>
            {clientId && (
                <h2 className="p-3">
                    Client {clientName} - {clientId}
                </h2>
            )}
            <div className="row">
                <div className="col">
                    <table id="portfolioTable" className="table table-hover">
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Description</th>
                                <th className="text-right">Bid</th>
                                <th className="text-right">Ask</th>
                            </tr>
                        </thead>
                        <tbody>
                            {portfolio.map(({ RIC, Description, Bid, Ask, ...rest }) => (
                                <tr
                                    key={RIC}
                                    onClick={() => showStockDetails({ RIC, Description, Bid, Ask, ...rest })}
                                >
                                    <td>{RIC}</td>
                                    <td>{Description}</td>
                                    <td className="text-right">
                                        {prices[RIC] ? prices[RIC].Bid : Bid}
                                    </td>
                                    <td className="text-right">
                                        {prices[RIC] ? prices[RIC].Ask : Ask}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Stocks;
