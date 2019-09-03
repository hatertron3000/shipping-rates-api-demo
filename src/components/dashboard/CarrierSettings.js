import React, { Component } from 'react'
import { API } from 'aws-amplify'
import {
    Panel,
    Box,
    Form,
    Input,
    ProgressCircle,
    H2,
    Button,
    Text
} from '@bigcommerce/big-design'
import {
    AddCircleOutlineIcon,
    DeleteIcon
} from '@bigcommerce/big-design-icons'

class CarrierSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            services: [],
            disabled: false,
        }

        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        this.setState({ loading: false })
    }

    handleClick() {
        this.setState({ disabled: true })
        const init = {
            body: {
                Hash: 'abcd1234',
                Services: [
                    {
                        "name": "Taco Express",
                        "price": "32"
                    }
                ]
            }
        }
        API.post(process.env.REACT_APP_RATESAPI, process.env.REACT_APP_SERVICESPATH, init)
            .then(data => {
                console.log(data)
                this.setState({ disabled: false })
            })
            .catch(err => {
                console.error(err)
                this.setState({ disabled: false })
            })
    }



    render() {
        return this.state.loading
            ? <div className="centered">
                <ProgressCircle size={'large'} />
            </div>
            : <Panel marginTop="small">
                <H2>{this.props.lang.heading}</H2>
                <Text>{this.props.lang.cta}</Text>
                <Button
                    disabled={this.state.disabled}
                    onClick={this.handleClick}
                >
                    {this.props.lang.save}
                </Button>
            </Panel>
    }
}

export default CarrierSettings