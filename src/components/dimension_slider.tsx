import * as React from 'react';
import * as moment from 'moment';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import * as _ from 'lodash';

import "./DimensionSlider.scss";

import "bootstrap-slider/dist/css/bootstrap-slider.min.css";

/**
 * A slider component for selecting data axis subsets
 * 
 * props:
 *  data: array, an array of data 
 *  isTime: boolean, if this is a time dimension
 *  modulo:
 *  moduloCycle: int
 *  name: string, the name of the dimension
 *  shape: array[number]
 *  units: string, the units for the dimension
 */
class DimensionSlider extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.slider = null;
        let format = null;
        let possible_values = props.data;
        this.input = (React as any).createRef();
        if (_.includes(props.units, "since")) {
            let [span, , startTime] = props.units.split(" ");
            switch (span) {
                case "years":
                    format = "YYYY";
                    break;
                case "months":
                    format = "YYYY-MM";
                    break;
                case "days":
                    format = "YYYY-MM-DD";
                    break;
                case "hours":
                case "minutes":
                    format = "YYYY-MM-DD HH:mm";
                    break;
                case "seconds":
                    format = "YYYY-MM-DD HH:mm:ss";
                    break;
            }
            this.formatter = function(data) {
                return moment(startTime, "YYYY-MM-DD")
                    .add(data, span)
                    .format(format);
            };
        }
        if (props.modulo) {
            let new_possible_values = [];
            let step = Math.abs(props.data[0] - props.data[1]);
            for (let i = -props.modulo; i <= props.modulo; i += step) {
                new_possible_values.push(i);
            }
            possible_values = new_possible_values;
        }
        this.singleValue = props.data.length == 1;
        let low_value = possible_values.indexOf(this.props.low_value);
        let high_value = possible_values.indexOf(this.props.high_value);
        this.state = {
            min: 0,
            max: possible_values.length - 1,
            value: [
                possible_values[low_value !== -1 ? low_value : possible_values.indexOf(this.props.data[0])],
                possible_values[high_value !== -1 ? high_value : possible_values.indexOf(this.props.data[this.props.data.length - 1])]
            ],
            stride: 1,
            data: possible_values
        };
    }
    slider: Slider
    singleValue: any
    formatter(data) {
        if (data.toFixed) {
            return data.toFixed(5);
        }
        return data;
    }
    input: any

    componentDidMount() {
        // props.data represents the original data array of values
        // state.data is the array of data created to allow greater ranges than the data contains
        // This is based of the modulo provided to us.
        // Example: props.data = [-180, ..., 175]
        //          state.data = [-360, ..., 360] (modulo: 360)

        let low_value = this.state.data.indexOf(this.props.low_value);
        if (low_value === -1) {
            low_value = this.state.data.indexOf(this.props.data[0]);
        }
        let high_value = this.state.data.indexOf(this.props.high_value);
        if (high_value === -1) {
            high_value = this.state.data.indexOf(this.props.data[this.props.data.length - 1]);
        }

        if (this.singleValue) {
            return;
        }

        this.slider = new Slider(this.input, {
            min: this.state.min,
            max: this.state.max,
            step: 1,
            value: [
                low_value !== -1 ? low_value : this.state.min,
                high_value !== -1 ? high_value : this.state.max
                // if the passed in prop value is invalid or not present we get -1 and use the min/max value instead
            ],
            range: true,
            tooltip: "hide",
            formatter: this.formatter
        }).on("change", arg => {
            var sliderValues = arg;
            var value = [this.state.data[sliderValues[0]], this.state.data[sliderValues[1]]];
            this.setState({ value });
        });
    }

    componentWillUnmount() {
        if (this.slider) {
            this.slider.destroy();
        }
    }

    // componentWillUpdate(nextProps, nextState) {
    //     if (this.state.value !== nextState.value) {
    //         this.slider.setValue([this.state.data.indexOf(nextState.value[0]), this.state.data.indexOf(nextState.value[1])]);
    //     }
    // }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.value !== prevState.value || this.state.stride !== prevState.stride) {
            this.changed();
        }
    }

    changed() {
        if (this.props.onChange) {
            this.props.onChange({
                range: this.state.value,
                stride: this.state.stride
            });
        }
    }

    render() {
        return (
            <div className="dimension-slider">
                {!this.singleValue && (
                    <div className="form-inline">
                        <FormControl
                            id="dimension-slider-select-lower"
                            bsSize="sm"
                            componentClass="select"
                            onChange={(e:any) => {
                                this.setState({ value: [parseInt(e.target.value), this.state.value[1]] });
                            }}
                            value={this.state.value[0]}
                        >
                            {this.state.data.map(data => {
                                return (
                                    <option key={data} value={data}>
                                        {this.formatter(data)}
                                    </option>
                                );
                            })}
                        </FormControl>
                        &nbsp;:&nbsp;
                        <FormControl
                            id="dimension-slider-select-upper"
                            bsSize="sm"
                            componentClass="select"
                            onChange={(e:any) => this.setState({ value: [this.state.value[0], parseInt(e.target.value)] })}
                            value={this.state.value[1]}
                        >
                            {this.state.data.map(data => {
                                return (
                                    <option key={data} value={data}>
                                        {this.formatter(data)}
                                    </option>
                                );
                            })}
                        </FormControl>
                        <FormGroup className="stride" bsSize="sm">
                            <ControlLabel>stride:&nbsp;</ControlLabel>
                            <FormControl
                                type="number"
                                min="1"
                                step="1"
                                value={this.state.stride}
                                onChange={(event:any) => this.setState({ stride: parseInt(event.target.value) })}
                            />
                        </FormGroup>
                        {!this.props.isTime && <small className="units">({this.props.units})</small>}
                        <input ref={input => (this.input = input)} />
                    </div>
                )}
                {this.singleValue && (
                    <div>
                        <span>
                            ({this.props.data.length}) {this.formatter(this.state.value[0])}
                        </span>
                    </div>
                )}
            </div>
        );
    }
}

export default DimensionSlider;
