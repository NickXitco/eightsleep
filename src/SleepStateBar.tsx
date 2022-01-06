import React from 'react';
import './GraphContent.css';
import {SLEEP_STATES} from "./App";
import {SleepStage} from "./Content";
import {toTimeString} from "./GraphInfo";

type SleepStateBarProps = {
    totalSleepTime: number,
    stage: SleepStage,
    startTime: Date,
    barOffset: number,
    graphEnabled: boolean
}

type SleepStateBarState = {
    hover: boolean,
}

export class SleepStateBar extends React.Component<SleepStateBarProps, SleepStateBarState> {
    constructor(props: SleepStateBarProps) {
        super(props);

        this.state = {
            hover: false
        }

        this.mouseOn = this.mouseOn.bind(this);
        this.mouseOff = this.mouseOff.bind(this);
        this.generateBarTooltipTimeString = this.generateBarTooltipTimeString.bind(this);

    }

    mouseOn() {
        this.setState({hover: true});
    }

    mouseOff() {
        this.setState({hover: false});
    }

    generateBarTooltipTimeString(): string {
        const startTime = this.props.startTime;
        const stageStartTime = new Date(startTime.getTime() + this.props.barOffset * 1000);
        const stageEndTime = new Date(stageStartTime.getTime() + this.props.stage.duration * 1000);

        return `${toTimeString(stageStartTime)} - ${toTimeString(stageEndTime)}`;
    }

    render() {
        const additionalClass = this.state.hover ? "bar-hover" : "bar-no-hover"
        const darkerClass = this.props.graphEnabled ? "bar-color-darker" : ""

        const alignClass = this.props.barOffset / this.props.totalSleepTime > 0.5 ? "tooltip-align-right" : ""

        const tooltip = (
            <div className={`bar-tooltip stage-tooltip ${alignClass}`}>
                <p className={"bar-tooltip-stage"}>{this.props.stage.stage}</p>
                <p className={"bar-tooltip-time"}>{this.generateBarTooltipTimeString()}</p>
            </div>
        );

        return (
            <div className={"bar"}
                 style={{
                     width: `${(this.props.stage.duration / this.props.totalSleepTime) * 100}%`,
                     height: '100%'
                 }}
            >
                <div className={`bar-color ${additionalClass} ${darkerClass}`}
                     style={{
                         background: `${SLEEP_STATES.get(this.props.stage.stage)}`
                     }}
                    onMouseEnter={this.mouseOn}
                    onMouseLeave={this.mouseOff}
                />
                {this.state.hover ? tooltip: null}
            </div>
        );
    }
}