import React, { Component } from 'react'
import { Box, H3, H4, Grid, Button, Text, Link } from '@bigcommerce/big-design'
import { AddIcon } from '@bigcommerce/big-design-icons'
import ServiceListItemEdit from './ServiceListItemEdit'


const ServicesEdit = (props) => {
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
                    <ServiceListItemEdit
                        lang={props.lang}
                        services={props.services}
                        setServices={props.setServices}
                        onDeleteClick={props.onDeleteClick}
                        index={props.services.indexOf(service)}
                        key={props.services.indexOf(service)}
                        name={service.name}
                        price={service.price}
                        expedited={service.expedited}
                        transit_time={service.transit_time} />
                ))}
                <Grid.Item>
                    <Link><Text onClick={props.onAddClick}>
                        <AddIcon color="success" size="large" />{props.lang.create}
                    </Text>
                    </Link>
                </Grid.Item>
            </Grid>
            <Button
                onClick={props.onSaveClick}
                margin="large"
                disabled={!props.servicesAreValid}
                isLoading={props.saving}
            >
                {props.lang.save}
            </Button>
        </Box>
    </>
}

export default ServicesEdit