import React from 'react';
import './stylesheets/GraphInfo.css';
import {adjustDay, captitalize, Checkbox, getDay, SleepInterval} from "./Content";
import { FitnessContainer } from './FitnessContainer';

type GraphInfoProps = {
    currentInterval: SleepInterval,
    propagateCheck: (checked: boolean, checkbox: Checkbox) => void,
    celsius: boolean,
    adjustmentHours: number
}

export class GraphInfo extends React.Component<GraphInfoProps, any>{
    constructor(props: GraphInfoProps) {
        super(props);

        this.checkboxChecked = this.checkboxChecked.bind(this);
    }

    checkboxChecked(e: React.ChangeEvent<HTMLInputElement>, checkbox: Checkbox) {
        this.props.propagateCheck(e.target.checked, checkbox);
    }

    render() {
        return (
            <div className={"graph-info"}>
                <div className={"margin-wrapper"}>
                    <div className={"info-color"}/>
                    <div className={"info-blur"}/>
                    <div className={"info-content"}>
                        <FitnessContainer currentInterval={this.props.currentInterval} celsius={this.props.celsius}/>

                        <div className={"stat-wheel-container"}>
                            <div className={"bed-time"}>
                                <div className={"stat-wheel-small-time"}>
                                    {toTimeString(this.props.currentInterval.ts)}
                                </div>
                                <div className={"stat-wheel-small-time-desc"}>
                                    Bed Time
                                </div>
                            </div>
                            <div className={"stat-wheel"}>
                                <div className={"total-sleep-time"}>
                                    {totalSleepTime(this.props.currentInterval)}
                                </div>
                                <div className={"sleep-name"}>
                                    {captitalize(getDay(adjustDay(this.props.currentInterval.ts, this.props.adjustmentHours)).fullName)}'s Sleep
                                </div>
                            </div>
                            <div className={"wake-time"}>
                                <div className={"stat-wheel-small-time"}>
                                    {wakeTime(this.props.currentInterval)}
                                </div>
                                <div className={"stat-wheel-small-time-desc"}>
                                    Wake Time
                                </div>
                            </div>
                        </div>

                        <div className={"graph-select-container"}>
                            <h2>Graphs</h2>
                            <div className={"graph-selectors"}>
                                <div className={"graph-selector"}>
                                    <input
                                        type="checkbox"
                                        onChange={(e) => this.checkboxChecked(e, Checkbox.HeartRate)}
                                    />
                                    <p>Heart Rate</p>
                                </div>
                                <div className={"graph-selector"}>
                                    <input
                                        type="checkbox"
                                        onChange={(e) => this.checkboxChecked(e, Checkbox.RespRate)}
                                    />
                                    <p>Respiratory Rate</p>
                                </div>
                                <div className={"graph-selector"}>
                                    <input
                                        type="checkbox"
                                        onChange={(e) => this.checkboxChecked(e, Checkbox.RoomTemp)}
                                    />
                                    <p>Room Temperature</p>
                                </div>
                                <div className={"graph-selector"}>
                                    <input
                                        type="checkbox"
                                        onChange={(e) => this.checkboxChecked(e, Checkbox.BedTemp)}
                                    />
                                    <p>Bed Temperature</p>
                                </div>
                            </div>
                        </div>

                        <div className={"tnt-select-container"}>
                            <h2>{this.props.currentInterval.timeseries.tnt.length}</h2>
                            <h3>
                                {
                                    this.props.currentInterval.timeseries.tnt.length === 1 ?
                                    "Toss and Turn" :
                                    "Tosses and Turns"
                                }
                            </h3>
                            <input
                                type="checkbox"
                                onChange={(e) => this.checkboxChecked(e, Checkbox.TnTTicks)}
                            />
                            <p>Show ticks</p>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}


function totalSleepTime(interval: SleepInterval):string {
    let totalSleepTime = 0;
    for (const t of interval.stages) {
        //TODO cut out awake/out of bed time?
        totalSleepTime += t.duration;
    }

    const hours = Math.floor(totalSleepTime / 60 / 60);
    const minutes = Math.floor((totalSleepTime - (hours * 60 * 60)) / 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`
}

function wakeTime(interval: SleepInterval):string {
    let totalSleepTime = 0;
    for (const t of interval.stages) {
        totalSleepTime += t.duration;
    }

    const endTime = new Date(interval.ts.getTime() + totalSleepTime * 1000);
    return toTimeString(endTime);
}

export function toTimeString(date: Date):string {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const suffix = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 === 0 ? 12 : hours % 12;

    return `${adjustedHours}:${minutes} ${suffix}`;
}