import React from 'react'
import { Box, H3, H4, Grid, Button } from '@bigcommerce/big-design'
import ServiceListItem from './ServiceListItem'

const ServicesList = (props) => {
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
                {props.services.map(service => (
                    <ServiceListItem
                        key={props.services.indexOf(service)}
                        name={service.name}
                        price={service.price}
                        expedited={service.expedited}
                        transit_time={service.transit_time} />
                ))}
            </Grid>
            <Button
                onClick={props.onEditClick}
                margin="large"
            >
                {props.lang.edit}
            </Button>
        </Box>
    </>
}


export default ServicesList