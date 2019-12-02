import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, Grid, Typography } from "@material-ui/core"
import { formatProperty, hiddenProperties, removeMailToPrefix } from '../utils/labels'

class InformationDialog extends React.Component {


    propertyValue = (keyValue) => {
        return (
            ((keyValue[0].indexOf('Url') >= 0) && (
                    <a href={keyValue[1]}>{keyValue[1]}</a>
            )) || ((keyValue[0].indexOf('Email') >= 0) &&  (
                    <a href={keyValue[1]}>{removeMailToPrefix(keyValue[1])}</a>
            )) || ( keyValue[1] )
        )
    }

    render() {
        const {zoneChangeInformation} = this.props
        return (
            <Dialog open={!!zoneChangeInformation} onClose={this.props.onClose}>
            <DialogContent>
            <Grid container  justify="center" direction="column" alignContent="center">
                {
                    zoneChangeInformation &&
                        Object.entries(zoneChangeInformation).map( (keyValue,index) => {
                            return !(hiddenProperties.has(keyValue[0])) && 
                                    <Typography key={index} align="left">{formatProperty(keyValue[0])}: {this.propertyValue(keyValue)}</Typography>
                        })
                }
            </Grid>
            </DialogContent>
            </Dialog>
        )
    }
}


InformationDialog.propTypes = {
    zoneChangeInformation: PropTypes.object,
    onClose: PropTypes.func.isRequired
};

export default InformationDialog