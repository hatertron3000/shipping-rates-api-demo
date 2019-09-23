import React, { Component } from 'react'
import { API } from 'aws-amplify'
import {
    Panel,
    ProgressCircle,
    H2,
    Text,
} from '@bigcommerce/big-design'
import Alert from '../../common/Alert'
import ServicesList from './ServicesList'
import ServicesEdit from './ServicesEdit'

class CarrierSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            services: [],
            disabled: false,
            errors: [],
            editing: false,
            saving: false,
        }

        this.handleAddClick = this.handleAddClick.bind(this)
        this.handleEditClick = this.handleEditClick.bind(this)
        this.handleDeleteClick = this.handleDeleteClick.bind(this)
        this.handleSaveClick = this.handleSaveClick.bind(this)
        this.setServices = this.setServices.bind(this)
        this.validateServices = this.validateServices.bind(this)
    }

    componentDidMount() {
        API.get(process.env.REACT_APP_RATESAPI, process.env.REACT_APP_SERVICESPATH)
            .then(res => {
                const services = this.validateServices(res)
                this.setState({ services, loading: false })
            })
            .catch(err => {
                console.error(err)
                let errors = this.state.errors
                errors.push(this.props.lang.error_initialization)
                this.setState({ errors, loading: false })
            })
    }

    validateServices(services) {
        const priceRegex = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/

        const validatedServices = services.map(service => {
            let newService = service
            newService.isValid = true
            if (newService.name.length > 100
                || newService.name.length < 1
                || !priceRegex.test(newService.price))
                newService.isValid = false
            return newService
        })
        return validatedServices
    }

    handleEditClick() {
        this.setState({ editing: true })
    }

    handleAddClick() {
        const defaultService = {
            name: "New Service",
            price: 8.00,
            expedited: false,
            transit_time: {
                duration: 7,
                units: "BUSINESS_DAYS"
            },
            isValid: true
        }

        let services = this.state.services
        services.push(defaultService)
        this.setState({ services })
    }

    handleDeleteClick(serviceToDelete) {
        const services = this.state.services.filter(service => service !== serviceToDelete)
        this.setState({ services })
    }

    handleSaveClick() {
        this.setState({ saving: true })
        const services = this.state.services.map(service => {
            service.price = parseFloat(service.price)
            return service
        })
        const init = {
            body: services
        }
        API.put(process.env.REACT_APP_RATESAPI, process.env.REACT_APP_SERVICESPATH, init)
            .then(res => {
                this.setState({ saving: false, editing: false, services: this.validateServices(res) })
            })
            .catch(err => {
                console.error(err)
                let errors = this.state.errors
                errors.push(this.props.lang.update_services_error)
                this.setState({ saving: false, errors })
            })

    }

    setServices(services) {
        services = this.validateServices(services)
        this.setState({ services })
    }



    render() {
        const servicesAreValid = this.state.services.find(service => !service.isValid) === undefined
            ? true
            : false

        return this.state.loading
            ? <div className="centered">
                <ProgressCircle size={'large'} />
            </div>
            : <Panel marginTop="small">
                <H2>{this.props.lang.heading}</H2>
                {this.state.errors.map(error => <Alert variant="warning" text={error} />)}
                <Text>{this.props.lang.cta}</Text>
                {this.state.services.length < 1
                    ? <Text>{this.props.lang.no_services}</Text>
                    : this.state.editing
                        ? <ServicesEdit
                            lang={this.props.lang}
                            services={this.state.services}
                            setServices={this.setServices}
                            onAddClick={this.handleAddClick}
                            onDeleteClick={this.handleDeleteClick}
                            onSaveClick={this.handleSaveClick}
                            servicesAreValid={servicesAreValid}
                            saving={this.state.saving} />
                        : <ServicesList
                            services={this.state.services}
                            lang={this.props.lang}
                            onEditClick={this.handleEditClick} />}
            </Panel>
    }
}

export default CarrierSettings