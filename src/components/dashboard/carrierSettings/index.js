import React, { Component } from 'react'
import { API } from 'aws-amplify'
import {
    Panel,
    ProgressCircle,
    H2,
    Button,
    Text
} from '@bigcommerce/big-design'
import Alert from '../../common/Alert'
import ServicesList from './ServicesList'

class CarrierSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            services: [],
            disabled: false,
            errors: [],
        }

        this.handleClick = this.handleClick.bind(this)
    }

    componentDidMount() {
        API.get(process.env.REACT_APP_RATESAPI, process.env.REACT_APP_SERVICESPATH)
            .then(res => {
                console.log(res)
                this.setState({ services: res, loading: false })
            })
            .catch(err => {
                console.log(err)
                let errors = this.state.errors
                errors.push('Error retrieving webhooks')
                this.setState({ errors, loading: false })
            })
    }

    handleClick() {
        this.setState({ disabled: true })
        const init = {
            body: {
                Services: [
                    {
                        "name": "Taco Express",
                        "price": "32",
                        "expedited": true,
                        "transit_time": {
                            "duration": "16",
                            "units": "DAYS"
                        }
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
                {this.state.errors.map(error => <Alert variant="warning" text={error} />)}
                <Text>{this.props.lang.cta}</Text>
                <ServicesList services={this.state.services} />
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