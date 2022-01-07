import React from 'react';
import './stylesheets/GraphContent.css';
import {toTimeString} from "./GraphInfo";

type TnTMarkerProps = {
    tntTime: Date,
    startTime: Date,
    totalSleepTime: number,
}

type TnTMarkerState = {
    hover: boolean,
}


export class TnTMarker extends React.Component<TnTMarkerProps, TnTMarkerState> {
    constructor(props: TnTMarkerProps) {
        super(props);

        this.state = {
            hover: false
        }

        this.mouseOn = this.mouseOn.bind(this);
        this.mouseOff = this.mouseOff.bind(this);
        this.generateTnTTooltipTimeString = this.generateTnTTooltipTimeString.bind(this);

    }

    mouseOn() {
        this.setState({hover: true});
    }

    mouseOff() {
        this.setState({hover: false});
    }

    generateTnTTooltipTimeString(): string {
        return `${toTimeString(this.props.tntTime)}`;
    }

    render() {
        const secondsOffset = (this.props.tntTime.getTime() - this.props.startTime.getTime()) / 1000;
        if (secondsOffset > this.props.totalSleepTime) return null; //Don't know if this would ever come up, but we should ignore this.

        const additionalClass = this.state.hover ? "tnt-hover" : "tnt-no-hover"
        const alignClass = secondsOffset / this.props.totalSleepTime > 0.5 ? "tooltip-align-right" : ""

        const tooltip = (
            <div className={`stage-tooltip ${alignClass}`}>
                <p className={"bar-tooltip-stage"}>{"Toss/Turn"}</p>
                <p className={"bar-tooltip-time"}>{this.generateTnTTooltipTimeString()}</p>
            </div>
        );

        return (
            <div
                className={`tnt-tick ${additionalClass}`}
                style={{
                    marginLeft: `${(secondsOffset / this.props.totalSleepTime) * 100}%`
                }}
                key={`tick${secondsOffset}`}
                onMouseEnter={this.mouseOn}
                onMouseLeave={this.mouseOff}
            >
                {this.state.hover ? tooltip: null}
            </div>
        );
    }
}