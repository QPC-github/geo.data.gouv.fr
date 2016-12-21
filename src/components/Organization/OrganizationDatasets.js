import React from 'react'
import { Link } from 'react-router'
import PublishedDatasets from '../Dataset/PublishedDatasets'
import { previousPage } from './OrganizationDatasets.css'

const OrganizationDatasets = ({ published, notPublishedYet, publishedByOthers }) => {
  return (
    <div>
      <PublishedDatasets datasets={notPublishedYet} title={'Données en attente de publication'} status={'error'} />
      <PublishedDatasets datasets={published} title={'Données publiées'} status={'success'} />
      <PublishedDatasets datasets={publishedByOthers} title={'Données publiées par une autre organisation'} status={'warning'} />
      <div className={previousPage}>
        <Link to={'/publication'}><i className="arrow left icon"></i> Retour aux organisations</Link>
      </div>
    </div>
  )
}

export default OrganizationDatasets
