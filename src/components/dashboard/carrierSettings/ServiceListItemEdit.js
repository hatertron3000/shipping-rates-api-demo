import React, { Component } from 'react'
import { Grid, Input, Dropdown, Form, Checkbox, Button, Flex, Link, Box } from '@bigcommerce/big-design'
import { ExpandMoreIcon, DeleteIcon } from '@bigcommerce/big-design-icons'

class ServiceListItemEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hovering: false,
            loading: false,
            name: props.name,
            nameError: '',
            price: props.price.toFixed(2),
            priceError: '',
            expedited: props.expedited,
            transit_time: props.transit_time
        }

        this.handleNameChange = this.handleNameChange.bind(this)
        this.handlePriceChange = this.handlePriceChange.bind(this)
        this.handleExpeditedChange = this.handleExpeditedChange.bind(this)
        this.handleUnitsChange = this.handleUnitsChange.bind(this)
        this.updateServices = this.updateServices.bind(this)
    }
    // TODO - FIX THIS
    updateServices() {
        let services = this.props.services
        services[this.props.index] = {
            name: this.state.name,
            price: this.state.price,
            expedited: this.state.expedited,
            transit_time: this.state.transit_time
        }

        this.props.setServices(services)
    }

    async handleNameChange(e) {
        if (e.target.value.length > 100 || e.target.value.length < 1) {
            await this.setState({ nameError: this.props.lang.error_name, name: e.target.value })
        }
        else
            await this.setState({ nameError: '', name: e.target.value })
        this.updateServices()
    }

    async handlePriceChange(e) {
        const priceRegex = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/
        const priceIsValid = priceRegex.test(e.target.value)
        if (priceIsValid)
            await this.setState({ price: e.target.value, priceError: '' })
        else
            await this.setState({ price: e.target.value, priceError: this.props.lang.error_price })
        this.updateServices()
    }

    async handleExpeditedChange(e) {
        await this.setState({ expedited: !this.state.expedited })
        this.updateServices()
    }

    async handleDurationChange(value) {
        let transit_time = this.state.transit_time
        transit_time.duration = parseInt(value)
        await this.setState({ transit_time })
        this.updateServices()
    }

    async handleUnitsChange(value) {
        let transit_time = this.state.transit_time
        transit_time.units = value
        await this.setState({ transit_time })
        this.updateServices()
    }

    render() {
        let durationValues = []
        for (let i = 1; i <= 90; i++) {
            durationValues.push(i)
        }

        let unitValues = ['DAYS', 'BUSINESS_DAYS', 'HOURS']

        return <>
            <Grid.Item
                padding="medium"
                shadow={this.state.hovering ? 'raised' : false}
                onMouseOver={() => this.setState({ hovering: true })}
                onMouseOut={() => this.setState({ hovering: false })}>
                <Form.Group>
                    <Input
                        value={this.state.name}
                        onChange={(e) => this.handleNameChange(e)}
                        error={this.state.nameError}
                    />
                </Form.Group>
            </Grid.Item>
            <Grid.Item
                padding="medium"
                shadow={this.state.hovering ? 'raised' : false}
                onMouseOver={() => this.setState({ hovering: true })}
                onMouseOut={() => this.setState({ hovering: false })}>
                <Form.Group>
                    <Input
                        value={this.state.price}
                        onChange={(e) => this.handlePriceChange(e)}
                        error={this.state.priceError}
                    />
                </Form.Group>
            </Grid.Item>
            <Grid.Item
                padding="medium"
                shadow={this.state.hovering ? 'raised' : false}
                onMouseOver={() => this.setState({ hovering: true })}
                onMouseOut={() => this.setState({ hovering: false })}>
                <Form.Group>
                    <Checkbox
                        label={this.props.lang.expedited}
                        checked={this.state.expedited}
                        onChange={this.handleExpeditedChange}
                    />
                </Form.Group>
            </Grid.Item>
            <Grid.Item
                padding="medium"
                shadow={this.state.hovering ? 'raised' : false}
                onMouseOver={() => this.setState({ hovering: true })}
                onMouseOut={() => this.setState({ hovering: false })}>
                <Flex>
                    <Form.Group>
                        <Dropdown
                            onItemClick={value => this.handleDurationChange(value)}
                            trigger={<Button>{this.state.transit_time.duration} <ExpandMoreIcon size="medium" color="white" /></Button>}
                        >
                            {durationValues.map(value => <Dropdown.Item key={durationValues.indexOf(value)} value={value}>
                                {value}
                            </Dropdown.Item>)}
                        </Dropdown>
                        <Dropdown
                            onItemClick={value => this.handleUnitsChange(value)}
                            trigger={<Button>{this.state.transit_time.units} <ExpandMoreIcon size="medium" color="white" /></Button>}
                        >
                            {unitValues.map(value => <Dropdown.Item key={unitValues.indexOf(value)} value={value}>
                                {value}
                            </Dropdown.Item>)}
                        </Dropdown>

                    </Form.Group>
                    <Box paddingTop="xSmall" marginLeft="large">
                        <Link>
                            <DeleteIcon
                                color="danger"
                                size="xLarge"
                                onClick={() => this.props.onDeleteClick(this.props.services[this.props.index])} />
                        </Link>
                    </Box>
                </Flex>
            </Grid.Item>
        </>
    }
}

export default ServiceListItemEdit