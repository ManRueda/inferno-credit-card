/* global NAME, VERSION */
import React from 'react'
import ReactDOM from 'react-dom'
import { Catalog, CodeSpecimen, ReactSpecimen } from 'catalog'

// Add your documentation imports here. These are available to
// React specimen. Do NOT pass React here as Catalog does that.
const documentationImports = {}
const title = `${NAME} v${VERSION}`
const pages = [
  {
    path: '/',
    title: 'Introduction',
    component: require('../README.md')
  }
]

// Catalog - logoSrc="../images/logo.png"
ReactDOM.render(
  <div>
    <Catalog
      imports={documentationImports}
      pages={pages}
      specimens={{
        javascript: props => <CodeSpecimen {...props} lang='javascript' />,
        js: props => <CodeSpecimen {...props} lang='javascript' />,
        jsx: props => <ReactSpecimen {...props} />
      }}
      title={title}
    />
  </div>,
  document.getElementById('app')
)
