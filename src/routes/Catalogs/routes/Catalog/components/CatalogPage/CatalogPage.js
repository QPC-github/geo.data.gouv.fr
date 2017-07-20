import React from 'react'
import PropTypes from 'prop-types'

import Loader from 'common/components/Loader'

import CatalogView from '../CatalogView'

import styles from './CatalogPage.scss'

const CatalogPage = ({ catalog, metrics, harvests, search, getHarvests, syncCatalog }) => (
  <div className={styles.container}>
    <Loader loading={catalog.pending || metrics.pending} error={catalog.error || metrics.error}>
      <CatalogView
        catalog={catalog.catalog}
        metrics={metrics.metrics}
        harvests={harvests}
        search={search}
        getHarvests={getHarvests}
        syncCatalog={syncCatalog}
      />
    </Loader>
  </div>
)

CatalogPage.propTypes = {
  catalog: PropTypes.shape({
    catalog: PropTypes.object,

    pending: PropTypes.bool.isRequired,

    error: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object
    ]).isRequired,
  }).isRequired,

  metrics: PropTypes.shape({
    metrics: PropTypes.object,

    pending: PropTypes.bool.isRequired,

    error: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object
    ]).isRequired
  }).isRequired,

  harvests: PropTypes.object.isRequired,

  search: PropTypes.func.isRequired,
  getHarvests: PropTypes.func.isRequired,
  syncCatalog: PropTypes.func.isRequired
}

export default CatalogPage
