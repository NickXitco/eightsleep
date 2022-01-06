import React from 'react';
import { houseIcon } from './App';
import './Header.css';
import {fToC} from "./Content";

type Profile = {
    name: string,
    image: string
}

type HeaderProps = {
    profiles: Profile[],
    currentID: string,
    propagateClick: (name: string) => void,
    propagateTemp: (temp: boolean) => void
};

type HeaderState = {
    celsius: boolean
};

export class Header extends React.Component<HeaderProps, HeaderState> {
    constructor(props: HeaderProps) {
        super(props);

        const storedTemp = window.localStorage.getItem("tempSetting");

        this.state = {
            celsius: storedTemp ? storedTemp === "true" : false
        }

        this.flipTemp = this.flipTemp.bind(this);
    }

    flipTemp() {
        this.props.propagateTemp(!this.state.celsius);
        this.setState({celsius: !this.state.celsius})
    }

    render() {

        const headshots = this.props.profiles.map((profile, i) => {
            const additionalClass = profile.name === this.props.currentID ? "profile-headshot-selected" : ""
            return (
                <div
                    className={`profile-headshot ${additionalClass}`}
                    onClick={() => {
                        this.props.propagateClick(profile.name);
                    }}
                    key={`profile${i}`}
                >
                    <img src={profile.image} alt={profile.name}/>
                </div>
            );
        });

        const fakeTemp = this.state.celsius ? fToC(72).toFixed(0) : 72;
        const tempUnit = this.state.celsius ? "C" : "F"

        return (
            <div id={"header"}>
                <div id={"header-sides"}>
                    <div id={"header-left"}>
                        <div id={"eight-sleep-logo-container"}>
                            <img src="8sleeplogo.svg" alt="Eight Sleep Demo"/>
                        </div>
                    </div>
                    <div id={"header-right"}>
                        <div className={"temperature-glance"}>
                            <div className={"temperature-reading"}>
                                {houseIcon("white")}
                                <h4>{`${fakeTemp}°${tempUnit}`}</h4>
                            </div>
                            <div className={"temperature-switch"}>
                                <p>C</p><div><div style={{marginLeft: `${this.state.celsius ? "0" : "15px"}`}} onClick={this.flipTemp}/></div><p>F</p>
                            </div>
                        </div>
                        <div className={"profiles"}>
                            {headshots}
                        </div>
                    </div>
                </div>
                <div id={"header-line"}/>
            </div>
        )
    }
}