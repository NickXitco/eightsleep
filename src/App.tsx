import React from 'react';
import './App.css';
import {Header} from './Header';
import {Content} from "./Content";
import AliceHeadshot from './headshots/alice_headshot.png';
import BobHeadshot from './headshots/bob_headshot.png';
import CharlieHeadshot from './headshots/charlie_headshot.png';

type AppProps = {

};

type AppState = {
    currentID: string,
    celsius: boolean,
    adjustmentFactor: number,
};


class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);

        const storedID = window.localStorage.getItem("currentID");
        const storedTemp = window.localStorage.getItem("tempSetting");
        this.state = {
            currentID: storedID ? storedID : "alice",
            celsius: storedTemp ? storedTemp === "true" : false,
            adjustmentFactor: 0
        }

        this.switchActiveProfile = this.switchActiveProfile.bind(this);
        this.switchTemp = this.switchTemp.bind(this);
    }

    switchActiveProfile(name: string) {
        window.localStorage.setItem("currentID", name);
        this.setState({currentID: name});
    }

    switchTemp(temp: boolean) {
        window.localStorage.setItem("tempSetting", temp.toString());
        this.setState({celsius: temp});
    }

    componentDidMount() {
        fetch("http://localhost:3000/adjustment_factor")
            .then(response => response.json())
            .then(data => this.setState({adjustmentFactor: data}));
    }

    render() {
        const profiles = [
            {
                name: "alice",
                image: AliceHeadshot,
            },
            {
                name: "bob",
                image: BobHeadshot,
            },
            {
                name: "charlie",
                image: CharlieHeadshot,
            },
        ];


        return (
            <div id={"app"}>
                <Header
                    profiles={profiles}
                    currentID={this.state.currentID}
                    propagateClick={this.switchActiveProfile}
                    propagateTemp={this.switchTemp}
                />

                <Content currentID={this.state.currentID} celsius={this.state.celsius} adjustmentHours={this.state.adjustmentFactor}/>

                {/*<nav*/}
                {/*    style={{*/}
                {/*        borderBottom: "solid 1px",*/}
                {/*        paddingBottom: "1rem"*/}
                {/*    }}*/}
                {/*>*/}
                {/*    /!*<Link to="/invoices">Invoices</Link> |{" "}*!/*/}
                {/*    /!*<Link to="/expenses">Expenses</Link>*!/*/}
                {/*</nav>*/}
            </div>
        )
    }
}


export const SLEEP_STATES = new Map();
SLEEP_STATES.set("off", "rgb(0,0,0)");
SLEEP_STATES.set("out", "rgb(6,25,64)");
SLEEP_STATES.set("awake", "rgb(12,49,128)");
SLEEP_STATES.set("light", "rgb(18,74,191)");
SLEEP_STATES.set("deep", "rgb(24,98,255)");

export function heartIcon(color: string): JSX.Element {
    return (
        <svg className={"tooltip-icon"} viewBox="0 0 510.23 457.56">
            <g fill={"none"} stroke={color} strokeLinecap={"round"} strokeLinejoin={"round"} strokeWidth={40}>
                <path d="M255.12,81.22C203.18-21.44,15-10.78,15,155.89S255.12,442.56,255.12,442.56s240.11-120,240.11-286.67S307.06-21.44,255.12,81.22Z"/>
                <polyline points="403.18 228.78 284.51 228.78 255.12 170.49 189.84 287.82 128.84 170.49 96.51 229.16 30.28 229.16"/>
            </g>
        </svg>
    );
}

export function houseIcon(color: string): JSX.Element {
    return (
        <svg className={"tooltip-icon"} viewBox="0 0 510.23 457.56">
            <path fill={"none"} stroke={color} strokeLinecap={"round"} strokeLinejoin={"round"} strokeWidth={40}
                  d="M229.52,15,15,166.42V418.8H186.61V305.23c0-20.91,19.21-37.86,42.91-37.86h0c23.69,0,42.9,16.95,42.9,37.86V418.8H444V166.42Z"/>
        </svg>
    )
}

export function breathIcon(color: string): JSX.Element {
    return (
        <svg className={"tooltip-icon"} viewBox="0 0 291.14 331">
            <g fill={"none"} stroke={color} strokeLinecap={"round"} strokeLinejoin={"round"} strokeWidth={40}>
                <path d="M276.14,163.07H83.35A67.38,67.38,0,0,1,34,142c-10.4-11.16-19-27.95-19-53,0-63.76,47.26-74,71.94-74s43.18,18.51,43.18,45.24S113.67,112,84.88,112"/>
                <path d="M272,221.4h-144s-45.25-4.11-45.25,45.24c0,39,26.74,49.36,49.36,49.36s26.7-21.55,26.82-26.82c.45-20.48-16.42-26.75-26.76-26.75"/>
            </g>
        </svg>
    )
}

export function bedIcon(color: string): JSX.Element {
    return (
        <svg className={"tooltip-icon"} viewBox="0 0 486 461.35">
            <g fill={"none"} stroke={color} strokeLinecap={"round"} strokeLinejoin={"round"} strokeWidth={40}>
                <path d="M36.76,237V75.57A60.57,60.57,0,0,1,97.33,15H388.67a60.57,60.57,0,0,1,60.57,60.57V233"/>
                <path d="M84.78,209.91V170.8a32.88,32.88,0,0,1,32.89-32.89h80.89a32.88,32.88,0,0,1,32.88,32.89v38.11"/>
                <path d="M254.56,208.91V170.8a32.88,32.88,0,0,1,32.88-32.89h80.89a32.88,32.88,0,0,1,32.89,32.89v39.11"/>
                <path d="M111.67,209.47H374.33A96.67,96.67,0,0,1,471,306.13v90.44a0,0,0,0,1,0,0H15a0,0,0,0,1,0,0V306.13A96.67,96.67,0,0,1,111.67,209.47Z"/>
                <line x1="15" y1="340.58" x2="471" y2="340.58"/>
                <path d="M63.46,400.36v21.76a24.23,24.23,0,0,1-24.23,24.23h0A24.23,24.23,0,0,1,15,422.12V400.36"/>
                <path d="M471,400.36v21.76a24.23,24.23,0,0,1-24.23,24.23h0a24.23,24.23,0,0,1-24.23-24.23V400.36"/>
            </g>
        </svg>
    );
}

export default App;
