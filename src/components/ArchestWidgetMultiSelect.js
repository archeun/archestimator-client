import React, {Component} from "react";
import Select from 'react-select';

const _ = require('lodash');

class ArchestWidgetMultiSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {values: this.getPreparedMultiChoices(this.props.values)};
        this.onChange = this.onChange.bind(this);
        this.getPreparedMultiChoices = this.getPreparedMultiChoices.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {...prevState, values: nextProps.values};
    }

    onChange(currentValues, eventData) {
        let selectedValues = _.map(currentValues, (currentValue) => currentValue.value.toString());

        let values = _.filter(this.props.options, (option) => selectedValues.indexOf(option.id.toString()) !== -1);
        this.setState({values: values});

        return this.props.onChange(values, eventData);
    }

    getPreparedMultiChoices(entities) {
        return _.map(entities, (entity) => {
            return {value: entity[this.props.valueGetter], label: entity[this.props.labelGetter]}
        });
    }

    render() {
        return (
            <Select size={'sm'}
                    name={this.props.name}
                    className={'archest-multi-select-container'}
                    onChange={this.onChange}
                    isMulti
                    value={this.getPreparedMultiChoices(this.state.values)}
                    options={this.getPreparedMultiChoices(this.props.options)}/>
        );
    }
}

export default ArchestWidgetMultiSelect;
