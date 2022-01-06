import React from 'react';
import './Content.css';
import {adjustDay, captitalize, getDay, SleepInterval} from "./Content";

type SleepSessionBubbleProps = {
    interval: SleepInterval,
    index: number,
    indexInUse: number,
    clickBubble: (i: number) => void,
    adjustmentHours: number
}

export class SleepSessionBubble extends React.Component<SleepSessionBubbleProps, any>{
    render() {
        const additionalClassName = this.props.index === this.props.indexInUse ? "sleep-session-bubble-selected" : "";

        return (
            <li
                className={`sleep-session-bubble ${additionalClassName}`}
                key={this.props.interval.id}
                onClick={() => this.props.clickBubble(this.props.index)}
            >
                <h2>
                    {this.props.interval.score}
                </h2>
                <p>
                    {captitalize(getDay(adjustDay(this.props.interval.ts, this.props.adjustmentHours)).shortHand)}
                </p>
            </li>
        );
    }

}