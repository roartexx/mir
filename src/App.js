import React, { Component } from 'react';
import './App.css';
import data from './data.json';

class App extends Component {
    constructor(props) {
        super(props);

        const model = localStorage['instances'] ? JSON.parse(localStorage['instances']) : data;   
        this.state = {
            model: model,
            theTime: this.getCurrentTime()
        };

        this.startInterval = this.startInterval.bind(this);
        this.enterBoss = this.enterBoss.bind(this);
        this.getCurrentTime = this.getCurrentTime.bind(this);
    }

    componentWillMount() {
        this.startInterval();
    }

    enterBoss(key) {
        const model = this.state.model;
        model[key].last_entered = this.getCurrentTime();
        this.setState({ model: model });
        localStorage['instances'] = JSON.stringify(model);
    }

    getCurrentTime() {
        return Math.floor(Date.now() / 1000);
    }

    startInterval() {
        setInterval(() =>{
            const theTime = this.getCurrentTime();
            this.setState({ theTime: theTime });
        }, 1000);
    }

    prettyDate(date, startDate) {
        const secs = startDate - date;
        
        if (secs < 60) return secs + " secs";
        if (secs < 3600) return Math.floor(secs / 60) + " mins";
        if (secs < 86400) return Math.floor(secs / 3600) + " hours " + (Math.floor(secs / 60) - (Math.floor(secs / 3600) * 60)) + ' mins';
        if (secs < 604800) return Math.floor(secs / 86400) + " days";
        
        return date.toDateString();
    }   

    timeRemaining(data, key) {
        const startDate = (data.cooldown * 60 * 60) + data.last_entered;
        const date = this.state.theTime;
        if(startDate > date){
            return <p>Time left: <strong>{ this.prettyDate(date, startDate) }</strong></p>
        } else {
            return <button onClick={ () => this.enterBoss(key) }>Enter Boss</button>
        }

        
    }

    render() {
        const model = this.state.model;

        return (
            <div className="App">
                <img src="logo.png" className="logo" alt="logo" />
                {
                    Object.keys(model).map((index, key) => {
                        const data = model[index];
                        return(
                            <div className="boss-item" key={ key }>
                                <img src={ index + '.bmp' } alt={ index } />
                                <h2>{ index }</h2>
                                <p>Cooldown: { data.cooldown } hours</p>
                                { this.timeRemaining(data, index) }
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

export default App;
