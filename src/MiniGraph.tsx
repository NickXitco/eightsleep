import React from 'react';
import './GraphInfo.css';
import {TimeSeries} from "./Content";
import {Line, LineChart, ResponsiveContainer, YAxis} from "recharts";

type MiniGraphProps = {
    timeseries: TimeSeries[],
    digits: number,
    unit: string,
    legend: string
}

export class MiniGraph extends React.Component<MiniGraphProps, any>{
    render() {
        const average = tsAverage(this.props.timeseries).toFixed(this.props.digits);
        const miniGraph = generateMiniGraph(this.props.timeseries);

        return (
            <div className={"mini-graph-container"}>
                <div className={"mini-graph-info"}>
                    <div className={"mini-graph-value"}>
                        <h5>
                            {average}
                        </h5>
                        <p>{this.props.unit}</p>
                    </div>
                    <div className={"mini-graph-legend"}>
                        <p>{this.props.legend}</p>
                    </div>
                </div>
                {miniGraph}
            </div>
        );
    }
}


function tsAverage(ts: TimeSeries[]):number {
    let total = 0;
    for (const t of ts) {
        total += t.value
    }
    return total / ts.length;
}

function generateMiniGraph(ts: TimeSeries[]) {
    //TODO maybe in the future we can take an average 4 points?
    const usableTS = ts.slice(0, 4);

    let minInTS = Infinity;
    let maxInTS = -Infinity;
    for (const t of usableTS) {
        minInTS = Math.min(t.value, minInTS);
        maxInTS = Math.max(t.value, maxInTS);
    }

    return (
        <div className={"mini-graph"}>
            <ResponsiveContainer width={"100%"} height={"40%"}>
                <LineChart data={usableTS}>
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#808080"
                        isAnimationActive={false}
                    />
                    <YAxis
                        domain={[minInTS, maxInTS]}
                        hide={true}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}