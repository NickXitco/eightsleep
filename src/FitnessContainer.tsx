import React from 'react';
import './stylesheets/GraphInfo.css';
import {cToF, SleepInterval, TimeSeries} from "./Content";
import { MiniGraph } from './MiniGraph';

type FitnessContainerProps = {
    currentInterval: SleepInterval,
    celsius: boolean,
}


export class FitnessContainer extends React.Component<FitnessContainerProps, any> {
    render() {

        const pretendAverageSleepScore = 40;

        function convertTimeSeriesToFahrenheit(ts: TimeSeries[]) {
            let newTS = [];
            for (const t of ts) {
                newTS.push({
                    time: t.time,
                    value: cToF(t.value)
                })
            }
            return newTS
        }

        const oldBedTempTS = this.props.currentInterval.timeseries.tempBedC;
        const bedTempTS = this.props.celsius ? oldBedTempTS : convertTimeSeriesToFahrenheit(oldBedTempTS)

        return (
            <div className={"fitness-container"}>
                <div className={"fitness-ball"}>
                    <div className={"fitness-score"}>
                        <h1>{this.props.currentInterval.score}</h1>
                        <p>%</p>
                    </div>
                    <h4>Sleep Fitness</h4>
                    <svg className={"fitness-ball-meter"} width={210} height={210}>
                        <circle
                            cx={105}
                            cy={105}
                            r={97.5}
                            stroke={"#1660fe"}
                            strokeWidth={5}
                            fill={"none"}
                            strokeLinecap={"round"}
                            strokeDasharray={2 * Math.PI * 97.5}
                            strokeDashoffset={2 * Math.PI * 97.5 * (1 - this.props.currentInterval.score / 100)}
                        />
                    </svg>
                </div>
                <div className={"fitness-info-wrapper"}>
                    <div className={"fitness-info"}>
                        <div className={"fitness-topshelf"}>
                            <div className={"topshelf-text"}>
                                <p>
                                    That's <b>{this.props.currentInterval.score - pretendAverageSleepScore}% </b>
                                    higher than your average sleep fitness over the last month!
                                </p>
                            </div>
                        </div>
                        <div className={"fitness-shelf-divider"}/>
                        <div className={"fitness-bottomshelf"}>
                            <MiniGraph
                                timeseries={this.props.currentInterval.timeseries.heartRate}
                                digits={0}
                                legend={"HR"}
                                unit={"bpm"}
                            />
                            <MiniGraph
                                timeseries={this.props.currentInterval.timeseries.respiratoryRate}
                                digits={0}
                                legend={"RR"}
                                unit={"bpm"}
                            />
                            <MiniGraph
                                timeseries={bedTempTS}
                                digits={0}
                                legend={"Bed Temp"}
                                unit={this.props.celsius ? "°C" : "°F"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}