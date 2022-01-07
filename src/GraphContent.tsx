import React from 'react';
import './stylesheets/GraphContent.css';
import {Checkbox, cToF, SleepInterval, TimeSeries} from "./Content";
import {Area, AreaChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis} from 'recharts';
import {NameType, ValueType} from "recharts/types/component/DefaultTooltipContent";
import {bedIcon, breathIcon, heartIcon, houseIcon} from './App';
import {toTimeString} from './GraphInfo';
import {SleepStateBar} from './SleepStateBar';
import {TnTMarker} from "./TnTMarker";

type GraphContentProps = {
    data: SleepInterval
    celsius: boolean,
    graphsEnabled: boolean[],
    showTnT: boolean
}

function generateTnTs(tnts: TimeSeries[], startTime: Date, totalSleepTime: number) {
    const formattedTnTs = [];

    for (let i = 0; i < tnts.length; i++) {
        const t = tnts[i];

        formattedTnTs.push(
            <TnTMarker tntTime={t.time} startTime={startTime} totalSleepTime={totalSleepTime} key={`tnt${i}`}/>
        )
    }

    return formattedTnTs;
}

export class GraphContent extends React.Component<GraphContentProps, any>{
    render() {
        if (!this.props.data) return null;

        const interval = this.props.data;

        let anyGraphsEnabled = false;
        for (const g of this.props.graphsEnabled) {
            if (g) {
                anyGraphsEnabled = true;
                break;
            }
        }

        let totalSleepTime = 0;
        for (const stage of interval.stages) {
            totalSleepTime += stage.duration;
        }

        let barOffset = 0;
        const bars = interval.stages.map((stage, i) => {
            const bar = (
                <SleepStateBar
                    key={`SleepStateBar${i}`}
                    stage={stage}
                    totalSleepTime={totalSleepTime}
                    startTime={interval.ts}
                    barOffset={barOffset}
                    graphEnabled={anyGraphsEnabled}
                />
            );
            barOffset += stage.duration
            return (
                bar
            );
        });

        const tnts = generateTnTs(interval.timeseries.tnt, interval.ts, totalSleepTime);

        //Calculate the number of seconds we are off of the nearest 10 minute mark
        //TODO right now we're flooring the start sleep time to the nearest minute, you don't have to do this.
        //  If the start of the sleep had seconds of precision, you could round to that.
        const secondsOffset = (interval.ts.getMinutes() % 10) * 60;

        //The starting offset is 10 minutes minus the number of seconds we're off from a 10-minute mark
        let currentOffset = 10 * 60 - secondsOffset;
        let timeseriesObjects = createTimeseriesTicks(interval, currentOffset, totalSleepTime, secondsOffset);

        const startTime = interval.ts.getTime();
        let heartRates = processTimeseries(interval.timeseries.heartRate, totalSleepTime, startTime, false, this.props.celsius);
        let respRates = processTimeseries(interval.timeseries.respiratoryRate, totalSleepTime, startTime, false, this.props.celsius);
        let roomTemps = processTimeseries(interval.timeseries.tempRoomC, totalSleepTime, startTime, true, this.props.celsius);
        let bedTemps = processTimeseries(interval.timeseries.tempBedC, totalSleepTime, startTime, true, this.props.celsius);
        const consolidatedTimeseries = consolidateTimeseries(heartRates, respRates, roomTemps, bedTemps);

        const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
            if (active && payload && payload.length) {
                const tooltipTime = new Date(interval.ts.getTime() + Number.parseInt(label) * 1000);

                let payloadLookup = new Map();
                for (const item of payload) {
                    payloadLookup.set(item.name, item.value);
                }

                const tempUnit = this.props.celsius ? "°C" : "°F";
                return renderTooltip(tooltipTime, payloadLookup, tempUnit);
            }

            return null;
        };

        const heartRateChart = generateChart("heart", "red", "url(#heartFill)", "bpm", "heartChart", !this.props.graphsEnabled[Checkbox.HeartRate]);
        const respRateChart = generateChart("resp", "magenta", "url(#respFill)", "bpm", "respChart", !this.props.graphsEnabled[Checkbox.RespRate]);
        const bedTempChart = generateChart("bed", "blue", "url(#bedFill)", "temp", "bedChart", !this.props.graphsEnabled[Checkbox.BedTemp]);
        const roomTempChart = generateChart("room", "cyan", "url(#roomFill)", "temp", "roomChart", !this.props.graphsEnabled[Checkbox.RoomTemp]);

        const charts: JSX.Element[] = [heartRateChart, bedTempChart, roomTempChart, respRateChart]

        const chart = (
            <AreaChart data={consolidatedTimeseries} margin={{ top: 0, left: 0, right: 0, bottom: 0 }} style={{pointerEvents: "auto"}}>
                <defs>
                    <linearGradient id="heartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="red" stopOpacity={0.5}/>
                        <stop offset="100%" stopColor="red" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="respFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="magenta" stopOpacity={0.5}/>
                        <stop offset="100%" stopColor="magenta" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="bedFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="blue" stopOpacity={0.5}/>
                        <stop offset="100%" stopColor="blue" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="roomFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="cyan" stopOpacity={0.5}/>
                        <stop offset="100%" stopColor="cyan" stopOpacity={0.05}/>
                    </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} cursor={false}/>

                {charts}

                <XAxis
                    dataKey={"offset"}
                    type={"number"}
                    domain={[0, totalSleepTime]}
                    hide={true}
                />
                <YAxis
                    type={"number"}
                    dataKey={"heart"}
                    hide={true}
                    yAxisId={"bpm"}
                />
                <YAxis
                    type={"number"}
                    dataKey={"bed"}
                    hide={true}
                    yAxisId={"temp"}
                />
            </AreaChart>
        )

        return (
            <div className={"graph-content"}>
                <div className={"inner-graph"}>
                    <div className={"svg-wrapper"}>
                        {anyGraphsEnabled ?
                            (
                                <ResponsiveContainer width={"100%"} height={"75%"}>
                                    {chart}
                                </ResponsiveContainer>
                            )
                            : null
                        }

                    </div>

                    <div className={`tnt-container ${!this.props.showTnT ? "tnt-container-hide" : ""}`}>
                        {tnts}
                    </div>

                    <div className={"bar-shade"}/>
                    <div
                        className={"bars"}
                    >
                        {bars}
                    </div>
                </div>
                <div className={"timescale"}>
                    {timeseriesObjects}
                </div>
            </div>
        );
    }
}

function lerpFindT(a:number, b:number, x:number):number {
    return (x - a) / (b - a);
}

function lerp(a:number, b:number, t:number):number {
    return a + t * (b - a);
}

function timestampToSecondsOffset(date: Date, startTime: number) {
    return (date.getTime() - startTime) / 1000;
}

function processTimeseries(timeseries: TimeSeries[], totalSleepTime: number, startTime: number, isTemp: boolean, celsius: boolean) {


    let processedTimeseries = [];

    // If we don't have a 0 time, make one
    if (timestampToSecondsOffset(timeseries[0].time, startTime) > 0 && timeseries.length > 1) {
        processedTimeseries.push({
           value: timeseries[0].value,
           offset: 0
        });
    }

    for (const timestamp of timeseries) {

        // Timeseries in this data set are all floored to the previous hour.
        // This is a bit problematic as we could have a sleep session that starts at 2:59, and presumably it'd
        // Have a timeseries stamp labeled for 2:00.
        // My thought is to clamp the first timeseries to the start of the sleep session.
        // If that's wrong for the sake of the interview, so be it.

        if (isTemp) {
            processedTimeseries.push(
                {
                    value: celsius ? timestamp.value : cToF(timestamp.value),
                    offset: Math.min(Math.max(timestampToSecondsOffset(timestamp.time, startTime), 0))
                }
            )
        } else {
            processedTimeseries.push(
                {
                    value: timestamp.value,
                    offset: Math.min(Math.max(timestampToSecondsOffset(timestamp.time, startTime), 0))
                }
            );
        }
    }

    //We're also gonna add another data point at the end of the sleep time so the graph looks complete
    processedTimeseries.push({value: processedTimeseries[processedTimeseries.length - 1].value, offset: totalSleepTime});
    return processedTimeseries;
}

function consolidateTimeseries(heartRates: any[], respRates: any[], roomTemps: any[], bedTemps: any[]) {
    // So the idea is we want to join our roomTemps and heartRate into one timeseries model.
    // As far as I know, recharts is built such that if we have one value on a particular timestep,
    // we need to have a value for every series for that timestep
    // (i.e. we can't have a room temp reading at 7:00am without a heart rate reading at 7:00am as well).
    // This presents an interesting problem. Because in some examples (like Alice #1), there was no heart rate
    // reading at 5AM and at 8AM, despite there being a room temp reading. This means we need to interpolate
    // the intermediate values. If we were doing this for real we could use a polynomial interpolation but that
    // seems like overkill for this interview. So I'm going to stick with lerp-ing everything.
    const consolidatedTimeseries = [];

    // So first, we should collect all timesteps present in our dataset
    const timesteps = new Set();
    for (const timestep of heartRates) timesteps.add(timestep.offset);
    for (const timestep of respRates) timesteps.add(timestep.offset);
    for (const timestep of roomTemps) timesteps.add(timestep.offset);
    for (const timestep of bedTemps) timesteps.add(timestep.offset);

    // We then want to order the timesteps
    const orderedTimesteps = Array.from(timesteps)
    orderedTimesteps.sort(function (a: any, b: any): number {
        return a - b;
    });

    function fillInTimeseries(ts: any[]) {
        //We should be able to safely assume that time 0 always has a value.
        for (let i = 1; i < orderedTimesteps.length; i++) {
            const tsA = orderedTimesteps[i] as number;
            const tsB = ts[i].offset as number;
            if (tsA !== tsB) {
                //We've encountered a timestep that the timeseries doesn't have a value for.
                ts.splice(i, 0, {
                    offset: tsA,
                    value: lerp(
                        ts[i - 1].value,
                        ts[i].value,
                        lerpFindT(ts[i - 1].offset, ts[i].offset, tsA)
                    )
                });
            }
        }
    }

    fillInTimeseries(heartRates);
    fillInTimeseries(respRates);
    fillInTimeseries(roomTemps);
    fillInTimeseries(bedTemps);

    //Great, now we can consolidate the four timeseries
    for (let i = 0; i < orderedTimesteps.length; i++) {
        consolidatedTimeseries.push({
            offset: orderedTimesteps[i],
            heart: heartRates[i].value,
            resp: respRates[i].value,
            room: roomTemps[i].value,
            bed: bedTemps[i].value,
        })
    }
    return consolidatedTimeseries;
}

function get12Hour(date: Date): number {
    const hours = date.getHours();
    return hours % 12 === 0 ? 12 : hours % 12;
}

function createTimeseriesTicks(interval: SleepInterval, currentOffset: number, totalSleepTime: number, secondsOffset: number) {
    let timeseriesObjects = [];
    let i = 0;

    while (currentOffset <= totalSleepTime) {
        const timeInHour = (currentOffset + secondsOffset) % (60 * 60);

        if (timeInHour < 10 * 60) {
            const timeString = get12Hour(new Date(interval.ts.getTime() + currentOffset * 1000));
            const translateAmount = timeString.toString().length === 1 ? "-0.1em" : "-0.4em";

            timeseriesObjects.push((
                <div
                    key={`tick${i}`}
                    style={{
                        marginLeft: `${100 * (currentOffset / totalSleepTime)}%`,
                        fontSize: '15px',
                        transform: `translate(${translateAmount}, 0)`,
                        textAlign: 'center'
                    }}
                    className={"timescale-tick"}
                >
                    {timeString}
                </div>
            ));
        } else {
            timeseriesObjects.push((
                <div
                    key={`tick${i}`}
                    style={{
                        marginLeft: `${100 * (currentOffset / totalSleepTime)}%`,
                        fontSize: '30px',
                        opacity: 0.5
                    }}
                    className={"timescale-tick"}
                >
                    .
                </div>
            ));
        }

        currentOffset += 10 * 60;
        i++;
    }
    return timeseriesObjects;
}

function renderTooltip(tooltipTime: Date, payloadLookup: Map<any, any>, tempUnit: string) {
    const tooltipTimeString = toTimeString(tooltipTime);

    const heartRateReading = payloadLookup.has("heart") ?
        <div className={"tooltip-value-container"}>
            {heartIcon("red")}
            <p className={"tooltip-value"}>
                {`${Number.parseFloat(payloadLookup.get("heart") as string).toFixed(1)} bpm`}
            </p>
        </div>
        : null;

    const respRateReading = payloadLookup.has("resp") ?
        <div className={"tooltip-value-container"}>
            {breathIcon("magenta")}
            <p className={"tooltip-value"}>
                {`${Number.parseFloat(payloadLookup.get("resp") as string).toFixed(1)} bpm`}
            </p>
        </div>
        : null;

    const bedTempReading = payloadLookup.has("bed") ?
        <div className={"tooltip-value-container"}>
            {bedIcon("blue")}
            <p className={"tooltip-value"}>
                {`${Number.parseFloat(payloadLookup.get("bed") as string).toFixed(1)} ${tempUnit}`}
            </p>
        </div>
        : null;

    const roomTempReading = payloadLookup.has("room") ?
        <div className={"tooltip-value-container"}>
            {houseIcon("cyan")}
            <p className={"tooltip-value"}>
                {`${Number.parseFloat(payloadLookup.get("room") as string).toFixed(1)} ${tempUnit}`}
            </p>
        </div>
        : null;

    return (
        <div className="custom-tooltip">
            <p className={"tooltip-time"}>{tooltipTimeString}</p>
            {heartRateReading}
            {respRateReading}
            {bedTempReading}
            {roomTempReading}
        </div>
    );
}

function generateChart(dataKey: string, color: string, fill: string, yAxisKey: string, key: string, hide: boolean) {
    return (
        <Area
            type={"monotone"}
            dataKey={dataKey}
            stroke={color}
            fill={fill}
            isAnimationActive={true}
            dot={true}
            yAxisId={yAxisKey}
            key={key}

            hide={hide}
        />
    );
}