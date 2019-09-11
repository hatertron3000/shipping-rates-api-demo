import React, { Component } from 'react'
import { Grid, Text } from '@bigcommerce/big-design'

class ServiceListItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hovering: false
        }
    }

    render() {
        return <>
            <Grid.Item
                padding="medium"
                shadow={this.state.hovering ? 'raised' : false}
                onMouseOver={() => this.setState({ hovering: true })}
                onMouseOut={() => this.setState({ hovering: false })}>
                <Text>
                    {this.props.name}
                </Text>
            </Grid.Item>
            <Grid.Item
                padding="medium"
                onMouseOver={() => this.setState({ hovering: true })}
                onMouseOut={() => this.setState({ hovering: false })}>
                <Text>
                    ${this.props.price.toFixed(2)}
                </Text>
            </Grid.Item>
            <Grid.Item
                padding="medium"
                onMouseOver={() => this.setState({ hovering: true })}
                onMouseOut={() => this.setState({ hovering: false })}>
                <Text>
                    {this.props.expedited ? 'True' : 'False'}
                </Text>
            </Grid.Item>
            <Grid.Item
                padding="medium"
                onMouseOver={() => this.setState({ hovering: true })}
                onMouseOut={() => this.setState({ hovering: false })}>
                <Text>
                    {this.props.transit_time.duration} {this.props.transit_time.units}
                </Text>
            </Grid.Item>
        </>
    }
}

export default ServiceListItem