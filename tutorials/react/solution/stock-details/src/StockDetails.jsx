import React, { useContext, useState } from "react";
import { GlueContext, useGlue } from "@glue42/react-hooks";
import { getMyWindowContext, subscribeForInstrumentStream } from "./glue";

function StockDetails() {
    const glue = useContext(GlueContext);
    const [windowContext, setWindowContext] = useState({});
    useGlue(getMyWindowContext(setWindowContext));
    const {
        symbol: { RIC, BPOD, Bloomberg, Description, Exchange, Venues } = {}
    } = windowContext || {};
    const [{ Bid, Ask }, setPrices] = useState({ Bid: windowContext.Bid, Ask: windowContext.Ask});
    useGlue(subscribeForInstrumentStream(setPrices), [RIC]);

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
                    <h1 className="text-center">Stock Details {RIC}</h1>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <table id="clientsTable" className="table table-hover">
                        <tbody>
                            <tr>
                                <th>RIC</th>
                                <td>{RIC}</td>
                            </tr>
                            <tr>
                                <th>BPOD</th>
                                <td>{BPOD}</td>
                            </tr>
                            <tr>
                                <th>Bloomberg</th>
                                <td>{Bloomberg}</td>
                            </tr>
                            <tr>
                                <th>Description</th>
                                <td>{Description}</td>
                            </tr>
                            <tr>
                                <th>Exchange</th>
                                <td>{Exchange}</td>
                            </tr>
                            <tr>
                                <th>Venues</th>
                                <td>{Venues}</td>
                            </tr>
                            <tr>
                                <th>Bid</th>
                                <td>{Bid}</td>
                            </tr>
                            <tr>
                                <th>Ask</th>
                                <td>{Ask}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default StockDetails;
