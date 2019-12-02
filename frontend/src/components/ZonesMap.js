import React, { Component } from 'react';
import Map from 'pigeon-maps'
import Marker from 'pigeon-marker'
import InformationDialog from './InformationDialog'
import UnpinnedZoneChangeTable from './UnpinnedZoneChangeTable'
import { Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';

// TODO: Remove this static test data once we have a backend to store scrapper data
import zoneRequestsData from '../data/zoneChangeRequestsTestData'

const cityOfWaterlooCoordinates = [43.4802042,-80.53831]

const styles = theme => ({
  unpinnedTable: {
    maxWidth: 300,
    fontSize: 24,
  }
});

class ZonesMap extends Component {

  constructor(props) {
    super(props)
    this.state = {
      zoneInformationDialog: undefined
    }
  }

  handleMarkerClick = ({ event, payload, anchor }) => {
    this.setDialogInformation(payload)
  }

  setDialogInformation = (dialog) => {
    this.setState({
      zoneInformationDialog: dialog
    })
  }

  resetDialogInformation = () => {
    this.setState({
      zoneInformationDialog: undefined
    })
  }

  render() {
    const { zoneInformationDialog } = this.state
    const { classes } = this.props
    return (
      <div>
        <InformationDialog zoneChangeInformation={zoneInformationDialog} onClose={this.resetDialogInformation}></InformationDialog>
        <Grid container spacing={2}>
          <Grid item>
            <Map center={cityOfWaterlooCoordinates} zoom={13} width={800}>
              {
                zoneRequestsData.map( (element, ix) => {
                  return !!element['locationCoordinates'] && 
                        (<Marker key={ix} anchor={element['locationCoordinates'].map( (c) => parseFloat(c))} 
                                  payload={element} onClick={this.handleMarkerClick} />)
                })
              }
            </Map>
          </Grid>
          <Grid item className={classes.unpinnedTable}>
            <UnpinnedZoneChangeTable zoneRequestsData={zoneRequestsData} 
                                  onZoneChangeClick={this.setDialogInformation}>
            </UnpinnedZoneChangeTable>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(ZonesMap);