import React, { Component } from 'react';
import Map from 'pigeon-maps'
import Marker from 'pigeon-marker'
import InformationDialog from './InformationDialog'
import UnpinnedZoneChangeTable from './UnpinnedZoneChangeTable'
import { Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import fetchData from '../utils/fetchData'

const cityOfWaterlooCoordinates = [43.4802042,-80.53831]

const styles = theme => ({
  unpinnedTableContainer: {
    maxWidth: "20%",
    fontSize: 24,
  },
  mapContainer: {
    minWidth: "800px",
    minHeight: "600px"
  }
});

class ZonesMap extends Component {

  constructor(props) {
    super(props)
    this.state = {
      zoneInformationDialog: undefined,
      zoneRequestsData: []
    }
    this.fetchDataFromBackend()
  }

  fetchDataFromBackend = () => {
    fetchData()
    .then( (fetchedZoneRequestData) => {
      this.setState({
        zoneRequestsData: fetchedZoneRequestData
      })
    })
    .catch((error) => {
      const retrySeconds = 10
      console.error(`Unable to fetch data from backend. Will retry in ${retrySeconds}sec. Details: ${error}`)
      setInterval(this.fetchDataFromBackend, retrySeconds*1000)
    })
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
    const { zoneInformationDialog, zoneRequestsData } = this.state
    const { classes } = this.props
    return (
      <div>
        <InformationDialog zoneChangeInformation={zoneInformationDialog} onClose={this.resetDialogInformation}></InformationDialog>
        <Grid container direction="row" spacing={2}>
          <Grid item className={classes.mapContainer}>
            <Map 
              center={cityOfWaterlooCoordinates} 
              zoom={13}>
              {
                zoneRequestsData.map( (element, ix) => {
                  return !!element['locationCoordinates'] && 
                        (<Marker key={ix} anchor={element['locationCoordinates'].map( (c) => parseFloat(c))} 
                                  payload={element} onClick={this.handleMarkerClick} />)
                })
              }
            </Map>
          </Grid>
          <Grid item className={classes.unpinnedTableContainer}>
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