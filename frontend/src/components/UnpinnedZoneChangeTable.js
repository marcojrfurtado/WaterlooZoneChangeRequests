import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core'
import { Typography } from '@material-ui/core'

const pointer = {cursor: 'pointer'};

class UnpinnedZoneChangeTable extends Component {

  render() {
    const { zoneRequestsData, onZoneChangeClick } = this.props
    return (
        <Table>
            <TableHead>
            <TableRow>
                <TableCell>
                    <Typography>
                        Unpinned Zone Change Requests
                    </Typography>
                </TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {
            zoneRequestsData.map( (element, ix) => {
                return !element['locationCoordinates'] && 
                (<TableRow key={ix} onClick={() => {onZoneChangeClick(element)}} style={pointer}>
                <TableCell>{element['locationName'] || element['id']}</TableCell>
                </TableRow>)
            })
            }
            </TableBody>
        </Table>
    );
  }
}

UnpinnedZoneChangeTable.propTypes = {
    zoneRequestsData: PropTypes.array,
    onZoneChangeClick: PropTypes.func.isRequired
};

export default UnpinnedZoneChangeTable;