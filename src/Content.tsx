import React from 'react';
import './stylesheets/Content.css';
import {GraphContent} from "./GraphContent";
import { GraphInfo } from './GraphInfo';
import {SleepSessionBubble} from "./SleepSessionBubble";

type ContentProps = {
    currentID: string,
    celsius: boolean,
    adjustmentHours: number
};

type ContentState = {
    data: SleepData | null,
    graphsEnabled: boolean[],
    interval: number,
    showTnT: boolean
};

export enum Checkbox {
    HeartRate,
    RespRate,
    BedTemp,
    RoomTemp,
    TnTTicks,
}

export class Content extends React.Component<ContentProps, ContentState> {
    constructor(props: ContentProps) {
        super(props);

        //This is dangerous because of out of bounds exceptions. Oh well.
        const storedInterval = window.localStorage.getItem("currentInterval");

        this.state = {
            data: null,
            graphsEnabled: [false, false, false, false],
            interval: storedInterval ? Number.parseInt(storedInterval) : 0,
            showTnT: false
        }

        this.checkboxGraphUpdate = this.checkboxGraphUpdate.bind(this);
        this.clickSleepSessionBubble = this.clickSleepSessionBubble.bind(this);
    }

    getData(id: string) {
        fetch(`http://localhost:3000/sleep_data/${id}`)
            .then(result => result.json())
            .then(data => this.processSleepData(data));
    }

    processSleepData(data: SleepData) {
        let processedSleepData = data;

        function processTimeseriesArray(tsArray: any[]): TimeSeries[] {
            const newTSArray = [];
            for (const ts of tsArray) {
                const time = ts[0];
                const value = ts[1];

                newTSArray.push(
                    {
                        value: value,
                        time: new Date(Date.parse(time)),
                    }
                )
            }
            return newTSArray;
        }

        for (const interval of processedSleepData.intervals) {
            const ts = interval.ts.toString();
            interval.ts = new Date(Date.parse(ts));
            interval.timeseries.heartRate = processTimeseriesArray(interval.timeseries.heartRate);
            interval.timeseries.heating = processTimeseriesArray(interval.timeseries.heating);
            interval.timeseries.respiratoryRate = processTimeseriesArray(interval.timeseries.respiratoryRate);
            interval.timeseries.tempBedC = processTimeseriesArray(interval.timeseries.tempBedC);
            interval.timeseries.tempRoomC = processTimeseriesArray(interval.timeseries.tempRoomC);
            interval.timeseries.tnt = processTimeseriesArray(interval.timeseries.tnt);
        }

        this.setState({data: processedSleepData});
    }

    checkboxGraphUpdate(checked: boolean, checkbox: number) {
        if (checkbox === Checkbox.TnTTicks) {
            this.setState({showTnT: checked});
            return;
        }

        const graphsEnabled = this.state.graphsEnabled;
        graphsEnabled[checkbox] = checked;
        this.setState({graphsEnabled: graphsEnabled});
    }

    clickSleepSessionBubble(index: number) {
        window.localStorage.setItem("currentInterval", index.toString());
        this.setState({interval: index});
    }

    componentDidMount() {
        this.getData(this.props.currentID);
    }

    componentDidUpdate(prevProps: Readonly<ContentProps>, prevState: Readonly<ContentState>, snapshot?: any) {
        if (this.props.currentID !== prevProps.currentID) {
            this.getData(this.props.currentID);
        }
    }

    render() {
        if (!this.state.data) {
            //TODO do a loading here?
            return null;
        }

        const currentInterval = this.state.data.intervals[this.state.interval];

        const sessions = this.state.data.intervals.map((interval, i) => (
            <SleepSessionBubble
                interval={interval}
                index={i}
                key={`SleepSessionBubble${i}`}
                indexInUse={this.state.interval}
                clickBubble={this.clickSleepSessionBubble}
                adjustmentHours={this.props.adjustmentHours}
            />
        ));

        return (
            <div id={"main-content"}>
                <div className={"main-content-header"}>
                    <h1>{`Sleep sessions for ${captitalize(this.props.currentID)}`}</h1>
                    <ul className={"sleep-sessions"}>
                        {sessions}
                    </ul>
                </div>

                <h3>{fullDayName(adjustDay(currentInterval.ts, this.props.adjustmentHours))}</h3>

                <div className={"graph-area"}>
                    <GraphContent data={currentInterval} celsius={this.props.celsius} graphsEnabled={this.state.graphsEnabled} showTnT={this.state.showTnT}/>
                    <GraphInfo currentInterval={currentInterval} propagateCheck={this.checkboxGraphUpdate} celsius={this.props.celsius} adjustmentHours={this.props.adjustmentHours}/>
                </div>
            </div>
        )
    }
}

/* ---DATE MANAGEMENT--- */

export function adjustDay(date: Date, adjustmentHours: number): Date {
    return new Date(date.getTime() + (adjustmentHours * 60 * 60 * 1000));
}

export function getDay(date: Date): Day {
    return DAYS[date.getDay()];
}

export function fullDayName(date: Date): string {
    const day = getDay(date);
    return `${captitalize(day.fullName)}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

type Day = {
    oneLetter: string,
    shortHand: string,
    fullName: string,
    num: number
}

const DAYS: Day[] = [
    {
        oneLetter: "s",
        shortHand: "sun",
        fullName: "sunday",
        num: 0
    },
    {
        oneLetter: "m",
        shortHand: "mon",
        fullName: "monday",
        num: 1
    },
    {
        oneLetter: "t",
        shortHand: "tue",
        fullName: "tuesday",
        num: 2
    },
    {
        oneLetter: "w",
        shortHand: "wed",
        fullName: "wednesday",
        num: 3
    },
    {
        oneLetter: "r",
        shortHand: "thu",
        fullName: "thursday",
        num: 4
    },
    {
        oneLetter: "f",
        shortHand: "fri",
        fullName: "friday",
        num: 5
    },
    {
        oneLetter: "s",
        shortHand: "sat",
        fullName: "saturday",
        num: 6
    },
]

const MONTHS: String[] = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]


export function captitalize(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/* ---SLEEP DATA TYPES--- */

export interface SleepData {
    intervals: SleepInterval[];
}

export interface SleepInterval {
    id: string;
    score: number;
    stages: SleepStage[];
    timeseries: SleepTimeseries;
    ts: Date;
}

export interface SleepStage {
    stage: string;
    duration: number;
}

export interface SleepTimeseries {
    heartRate: TimeSeries[] | any[];
    heating: TimeSeries[] | any[];
    respiratoryRate: TimeSeries[] | any[];
    tempBedC: TimeSeries[] | any[];
    tempRoomC: TimeSeries[] | any[];
    tnt: TimeSeries[] | any[];
}

export interface TimeSeries {
    time: Date;
    value: any;
}

/* ---Celsius to Fahrenheit--- */

export function cToF(c: number): number {
    return c * (9 / 5) + 32;
}

export function fToC(f: number): number {
    return (f - 32) * (5 / 9);
}