import React from 'react'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'

import Warning from 'common/components/Warning'
import Loader from 'common/components/Loader'
import { doneSince } from 'common/helpers/doneSince'

import Discussions from '../../../../modules/Datasets/components/Discussions/Discussions'

import DatasetBlock from '../DatasetBlock'
import DatasetHeader from '../DatasetHeader'
import DatasetHelmet from '../DatasetHelmet'
import DatasetTechnicalInfo from '../DatasetTechnicalInfo'
import DatasetDownloadList from '../DatasetDownloadList'
import DatasetLinks from '../DatasetLinks'
import DatasetFilters from '../DatasetFilters'
import DatasetProducer from '../DatasetProducer'
import DatasetThumbnails from '../DatasetThumbnails'
import DatasetSpatialExtent from '../DatasetSpatialExtent'
import DatasetDataGouvPublication from '../DatasetDataGouvPublication'
import DatasetContactList from '../DatasetContactList'

import styles from './DatasetView.scss'
import clouds from '../../../../components/PageLayout/images/clouds.svg'

class DatasetView extends React.PureComponent {
  static propTypes = {
    dataset: PropTypes.shape({
      recordId: PropTypes.string,
      metadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
        status: PropTypes.string,
        spatialExtent: PropTypes.object,
        contacts: PropTypes.array.isRequired,
        credit: PropTypes.string,
        links: PropTypes.array.isRequired
      }).isRequired,

      dataset: PropTypes.shape({
        distributions: PropTypes.array.isRequired
      }).isRequired
    }).isRequired,

    publication: PropTypes.shape({
      remoteId: PropTypes.string.isRequired
    }),

    dataGouvDataset: PropTypes.shape({
      dataset: PropTypes.object,

      pending: PropTypes.bool.isRequired,

      error: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.object
      ]).isRequired
    }).isRequired,

    getDataGouvDataset: PropTypes.func.isRequired,
    fetchGeoJson: PropTypes.func.isRequired,

    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { publication, getDataGouvDataset } = this.props

    if (publication && publication.remoteId) {
      getDataGouvDataset(publication.remoteId)
    }
  }

  render() {
    const { dataset, publication, dataGouvDataset, fetchGeoJson, t, i18n } = this.props
    const status = dataset.metadata.status
    const hasThumbnails = dataset.metadata.thumbnails && dataset.metadata.thumbnails.length > 0
    const datasetInfoLastUpdate = doneSince(dataset.revisionDate)

    return (
      <div>
        <div className={styles.header} style={`background: url(${clouds}) bottom / 101% no-repeat, linear-gradient(to top, #41dcd7, #3083b2)`} />
        <DatasetHelmet dataset={dataset} hasThumbnails={hasThumbnails} />
        {i18n.exists(`Dataset:components.DatasetView.consequences.${status}`) && (
          <Warning title={t('components.DatasetView.obsoleteWarning', { status: t(`enums.status.${status}`) })}>
            {t(`Dataset:components.DatasetView.consequences.${status}`)}
          </Warning>
        )}
        <div className={styles.container}>
          <div className={styles.side}>
            {publication && publication.remoteId && (
              <DatasetBlock>
                <Loader isLoading={dataGouvDataset.pending}>
                  {dataGouvDataset.dataset && (
                    <DatasetProducer organization={dataGouvDataset.dataset.organization} />
                  )}
                </Loader>
              </DatasetBlock>
            )}
            <DatasetBlock title={t('components.DatasetView.section.technicalInformation')}>
              <DatasetTechnicalInfo dataset={dataset} status={status} />
            </DatasetBlock>
            <DatasetBlock title={t('components.DatasetView.section.dgvPublication')}>
              <DatasetDataGouvPublication dataset={dataset} publication={publication} />
            </DatasetBlock>

            {dataset.metadata.contacts.length > 0 && (
              <DatasetBlock title={t('components.DatasetView.section.contacts')}>
                <DatasetContactList contacts={dataset.metadata.contacts} />
              </DatasetBlock>
            )}
            {dataset.metadata.credit && (
              <DatasetBlock title={t('components.DatasetView.section.contributions')}>
                <div>
                  {dataset.metadata.credit}
                </div>
              </DatasetBlock>
            )}
          </div>

          <div className={styles.center}>
            <DatasetHeader dataset={dataset} />
            <DatasetBlock title={t('components.DatasetView.section.downloads')}>
              {dataset.dataset.distributions.length > 0 ? (
                <DatasetDownloadList distributions={dataset.dataset.distributions} fetchGeoJson={fetchGeoJson} />
              ) : (
                <div>{t('components.DatasetView.noDownloads')}</div>
              )}
            </DatasetBlock>
            {publication && publication.remoteId && (
              <DatasetBlock title={t('components.DatasetView.section.discussions')}>
                <Discussions remoteId={publication.remoteId} />
              </DatasetBlock>
            )}
            {(dataset.metadata.keywords.length > 0 || dataset.organizations.length > 0) && (
              <DatasetBlock title={t('components.DatasetView.section.filters')}>
                <DatasetFilters
                  keywords={dataset.metadata.keywords}
                  organizations={dataset.organizations}
                />
              </DatasetBlock>
            )}
            <div className={styles.footer}>
              <div>{t('components.DatasetView.id')} : <b>{dataset.metadata.id}</b></div>
              <div>{t('components.DatasetView.datasetInfoLastUpdate')} : <b>{datasetInfoLastUpdate}</b></div>
            </div>
          </div>

          <div className={styles.side}>
            {hasThumbnails && (
              <DatasetBlock title={t('components.DatasetView.section.preview')}>
                <DatasetThumbnails recordId={dataset.recordId} thumbnails={dataset.metadata.thumbnails} />
              </DatasetBlock>
            )}

            {dataset.metadata.spatialExtent && (
              <DatasetBlock title={t('components.DatasetView.section.spatialExtent')}>
                <DatasetSpatialExtent extent={dataset.metadata.spatialExtent} />
              </DatasetBlock>
            )}
            {dataset.metadata.links.length > 0 && (
              <DatasetBlock title={t('components.DatasetView.section.links')}>
                <DatasetLinks links={dataset.metadata.links} />
              </DatasetBlock>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default translate('Dataset')(DatasetView)
