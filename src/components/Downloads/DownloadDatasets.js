import React, { Component } from 'react'
import PreviewMap from '../Map/PreviewMap'
import VectorDownload from '../Downloads/VectorDownload'
import OtherDownload from '../Downloads/OtherDownload'
import { fetchGeoJSON } from '../../fetch/fetch'
import { waitForDataAndSetState, cancelAllPromises } from '../../helpers/components'

const styles = {
  content: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  vector: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '50px',
  },
}

class DownloadDatasets extends Component {
  constructor(props) {
    super(props)
    this.state = {
      preview: null,
      errors: [],
    }
  }

  selectPreview(preview) {
    this.setState({geojson: null, errors: [], preview})
    return waitForDataAndSetState(fetchGeoJSON(preview.link), this, 'geojson')
  }

  componentWillUnmount() {
    return cancelAllPromises(this)
  }

  render() {
    const { distributions, style } = this.props
    const { format, preview, geojson, errors } = this.state
    const vectorDistributions = distributions.filter(distribution => !distribution.originalDistribution)
    const otherDistributions = distributions.filter(distribution => distribution.originalDistribution === true)

    let map = <div style={{marginLeft: '40%'}}></div>
    if (preview) {
    map = <PreviewMap
        distribution={preview ? preview.distribution : null}
        geojson={geojson}
        loading={preview && !geojson}
        errors={errors}/>
    }

    return (
      <div style={style.section}>
        <h3 style={style.title}>Téléchargements</h3>
        <div style={styles.content}>
          <div style={{flexGrow: 1}}>
            <VectorDownload
              style={styles.vector}
              distributions={vectorDistributions}
              format={format}
              choosePreview={(format) => this.selectPreview(format)}
              preview={preview} />
            {otherDistributions.length ? <OtherDownload distributions={otherDistributions} /> : null}
          </div>
          {map}
        </div>
      </div>
    )
  }
}

export default DownloadDatasets
