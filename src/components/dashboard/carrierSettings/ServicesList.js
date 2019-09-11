import React, { Component } from 'react'
import { Box, H3, H4, Grid } from '@bigcommerce/big-design'
import ServiceListItem from './ServiceListItem'

class ServicesList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editing: false,
            updating: false,
        }
    }

    render() {
        return <>
            <Box>
                <H3>Current Services</H3>
            </Box>
            <Box>
                <Grid
                    gridColumns="repeat(4, [col-start] minmax(100px, 4fr) [col-end])"
                    gridGap="30px">
                    <Grid.Item padding="medium">
                        <H4>Name</H4>
                    </Grid.Item>
                    <Grid.Item padding="medium">
                        <H4>Price</H4>
                    </Grid.Item>
                    <Grid.Item padding="medium">
                        <H4>Expedited</H4>
                    </Grid.Item>
                    <Grid.Item padding="medium">
                        <H4>Transit Time</H4>
                    </Grid.Item>
                    {this.props.services.map(service => (
                        <ServiceListItem
                            name={service.name}
                            price={service.price}
                            expedited={service.expedited}
                            transit_time={service.transit_time} />
                    ))}
                </Grid>
            </Box>
        </>
    }
}

export default ServicesList