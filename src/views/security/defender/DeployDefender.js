import React from 'react'
import { CCallout, CCol, CRow, CSpinner } from '@coreui/react'
import { Field, FormSpy } from 'react-final-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { CippWizard } from 'src/components/layout'
import { WizardTableField } from 'src/components/tables'
import PropTypes from 'prop-types'
import { RFFCFormSwitch } from 'src/components/forms'
import { useLazyGenericPostRequestQuery } from 'src/store/api/app'

const Error = ({ name }) => (
  <Field
    name={name}
    subscription={{ touched: true, error: true }}
    render={({ meta: { touched, error } }) =>
      touched && error ? (
        <CCallout color="danger">
          <FontAwesomeIcon icon={faExclamationTriangle} color="danger" />
          {error}
        </CCallout>
      ) : null
    }
  />
)

Error.propTypes = {
  name: PropTypes.string.isRequired,
}

const DeployDefender = () => {
  const [genericPostRequest, postResults] = useLazyGenericPostRequestQuery()

  const handleSubmit = async (values) => {
    // @todo: clean this up api sided so we don't need to perform weird tricks.
    Object.keys(values.standards).filter(function (x) {
      if (values.standards[x] === false) {
        delete values.standards[x]
      }
      return null
    })

    values.selectedTenants.map(
      (tenant) =>
        (values.standards[`Select_${tenant.defaultDomainName}`] = tenant.defaultDomainName),
    )
    //filter on only objects that are 'true'
    genericPostRequest({ path: '/api/AddStandardsDeploy', values: values.standards })
  }

  const formValues = {
    selectedTenants: [],
    standards: {},
  }

  return (
    <CippWizard
      initialValues={{ ...formValues }}
      onSubmit={handleSubmit}
      wizardTitle="Defender Setup Wizard"
    >
      <CippWizard.Page
        title="Tenant Choice"
        description="Choose the tenants to create the deployment for."
      >
        <center>
          <h3 className="text-primary">Step 1</h3>
          <h5 className="card-title mb-4">Choose a tenant</h5>
        </center>
        <hr className="my-4" />
        <Field name="selectedTenants">
          {(props) => (
            <WizardTableField
              reportName="Apply-Standard-Tenant-Selector"
              keyField="defaultDomainName"
              path="/api/ListTenants?AllTenantSelector=true"
              columns={[
                {
                  name: 'Display Name',
                  selector: (row) => row['displayName'],
                  sortable: true,
                  exportselector: 'displayName',
                },
                {
                  name: 'Default Domain Name',
                  selector: (row) => row['defaultDomainName'],
                  sortable: true,
                  exportselector: 'mail',
                },
              ]}
              fieldProps={props}
            />
          )}
        </Field>
        <Error name="selectedTenants" />
        <hr className="my-4" />
      </CippWizard.Page>
      <CippWizard.Page title="Defender Setup" description="Defender Compliance and MEM Reporting">
        <center>
          <h3 className="text-primary">Step 2</h3>
          <h5 className="card-title mb-4">Defender Setup</h5>
        </center>
        <hr className="my-4" />
        <div className="mb-2">
          <CRow className="mb-3">
            <CCol md={6}>
              <RFFCFormSwitch
                name="AllowMEMEnforceComPliance"
                label="Allow Microsoft Defender for Endpoint to enforce Endpoint Security Configurations (Compliance)"
              />
              <RFFCFormSwitch
                name="ConnectIosCompliance"
                label="Connect iOS/iPadOS devices version 13.0 and above to Microsoft Defender for Endpoint (Compliance)"
              />
              <RFFCFormSwitch
                name="ConnectAndroid"
                label="Connect Android devices version 6.0.0 and above to Microsoft Defender for Endpoint (Compliance)"
              />
              <RFFCFormSwitch
                name="ConnectWindows"
                label="Connect Windows devices version 10.0.15063 and above to Microsoft Defender for Endpoint (Compliance)"
              />
            </CCol>
            <CCol md={6}>
              <RFFCFormSwitch
                name="AppSync"
                label="Enable App Sync (sending application inventory) for iOS/iPadOS devices"
              />
              <RFFCFormSwitch name="BlockunsupportedOS" label="Block unsupported OS versions" />

              <RFFCFormSwitch
                name="ConnectAndroid"
                label="Connect Android devices to Microsoft Defender for Endpoint"
              />
              <RFFCFormSwitch
                name="ConnectIos"
                label="Connect iOS/iPadOS devices to Microsoft Defender for Endpoint"
              />
            </CCol>
          </CRow>
        </div>
        <hr className="my-4" />
      </CippWizard.Page>
      <CippWizard.Page
        title="Defender Defaults Policy"
        description="Select Defender policies to deploy"
      >
        <center>
          <h3 className="text-primary">Step 3</h3>
          <h5 className="card-title mb-4">AV policy</h5>
        </center>
        <hr className="my-4" />
        <div className="mb-2">
          <CRow className="mb-3">
            <CCol md={6}>
              <RFFCFormSwitch name="ScanArchives" label="Allow Archive Scanning" />
              <RFFCFormSwitch name="AllowBehavior" label="Allow behavior monitoring" />
              <RFFCFormSwitch name="AllowCloudProtection" label="Allow Cloud Protection" />
              <RFFCFormSwitch name="AllowEmailScanning" label="Allow e-mail scanning" />
              <RFFCFormSwitch name="standards.SecurityDefaults" label="Enable Security Defaults" />
              <RFFCFormSwitch
                name="AllowFullScanNetwork"
                label="Allow Full Scan on Network Drives"
              />
              <RFFCFormSwitch
                name="AllowFullScanRemovable"
                label="Allow Full Scan on Removable Drives"
              />
              <RFFCFormSwitch name="AllowIPS" label="Allow Intrusion Prevention System" />
            </CCol>
            <CCol md={6}>
              <RFFCFormSwitch name="AllowDownloadable" label="Allow scanning of downloaded files" />
              <RFFCFormSwitch name="AllowRealTime" label="Allow Realtime monitoring" />
              <RFFCFormSwitch name="AllowNetwork" label="Allow scanning of mapped drives" />
              <RFFCFormSwitch name="AllowUI" label="Allow users to access UI" />
              <RFFCFormSwitch name="CPULoad50" label="Set Maximum CPU load to 50%" />

              <RFFCFormSwitch name="CheckSigs" label="Check Signatures before scan" />
              <RFFCFormSwitch name="DisableCatchup" label="Disable Catchup Scan" />
            </CCol>
          </CRow>
        </div>
        <hr className="my-4" />
      </CippWizard.Page>
      <CippWizard.Page title="ASR" description="Set Attack Surface Reduction Rules.">
        <center>
          <h3 className="text-primary">Step 3</h3>
          <h5 className="card-title mb-4">ASR Rules</h5>
        </center>
        <hr className="my-4" />
        <div className="mb-2">
          <CRow className="mb-3">
            <CCol md={6}>
              <RFFCFormSwitch
                name="standards.DisableSharedMailbox"
                label="Disable Shared Mailbox AAD accounts"
              />
              <RFFCFormSwitch
                name="standards.DelegateSentItems"
                label="Set mailbox Sent Items delegation (Sent items for shared mailboxes)"
              />
              <RFFCFormSwitch
                name="standards.SendFromAlias"
                label="Allow users to send from their alias addresses"
              />
            </CCol>
            <CCol md={6}>
              <RFFCFormSwitch
                name="standards.AutoExpandArchive"
                label="Enable Auto-expanding archives"
              />
              <RFFCFormSwitch
                name="standards.SpoofWarn"
                label="Enable Spoofing warnings for Outlook (This e-mail is external identifiers)"
              />

              <RFFCFormSwitch
                name="standards.DisableViva"
                label="Disable daily Insight/Viva reports"
              />
            </CCol>
          </CRow>
        </div>
        <hr className="my-4" />
      </CippWizard.Page>

      <CippWizard.Page title="Review and Confirm" description="Confirm the settings to apply">
        <center>
          <h3 className="text-primary">Step 4</h3>
          <h5 className="card-title mb-4">Confirm and apply</h5>
        </center>
        <hr className="my-4" />
        {postResults.isFetching && (
          <CCallout color="info">
            <CSpinner>Loading</CSpinner>
          </CCallout>
        )}
        {!postResults.isSuccess && (
          <FormSpy>
            {(props) => (
              /* eslint-disable react/prop-types */ <>
                <CRow>
                  <CCol md={{ span: 6, offset: 3 }}>
                    <h5 className="mb-0">Selected Tenants</h5>
                    <CCallout color="info">
                      {props.values.selectedTenants.map((tenant, idx) => (
                        <li key={idx}>
                          {tenant.displayName}- {tenant.defaultDomainName}
                        </li>
                      ))}
                    </CCallout>
                    <h5 className="mb-0">Selected Standards</h5>
                    <CCallout color="info">
                      {Object.entries(props.values.standards).map(([key, value], idx) => (
                        <li key={idx}>
                          {key}: {value ? 'Enabled' : 'Disabled'}
                        </li>
                      ))}
                    </CCallout>
                    <hr />
                  </CCol>
                </CRow>
              </>
            )}
          </FormSpy>
        )}
        {postResults.isSuccess && <CCallout color="success">{postResults.data.Results}</CCallout>}
        <hr className="my-4" />
      </CippWizard.Page>
    </CippWizard>
  )
}

export default DeployDefender
