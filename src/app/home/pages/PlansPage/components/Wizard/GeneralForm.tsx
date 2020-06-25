import React, { useEffect, useRef } from 'react';
import { FormikProps, Field } from 'formik';
import { IFormValues, IOtherProps } from './WizardContainer';
import { Form, FormGroup, Grid, GridItem, TextInput, Title } from '@patternfly/react-core';
import spacing from '@patternfly/react-styles/css/utilities/Spacing/spacing';
import SimpleSelect from '../../../../../common/components/SimpleSelect';
import TokenSelect from './TokenSelect';
import { INameNamespaceRef } from '../../../../../common/duck/types';
const styles = require('./GeneralForm.module');

interface IGeneralFormProps
  extends Pick<IOtherProps, 'clusterList' | 'storageList' | 'isEdit'>,
    Pick<
      FormikProps<IFormValues>,
      | 'handleBlur'
      | 'handleChange'
      | 'setFieldTouched'
      | 'setFieldValue'
      | 'values'
      | 'touched'
      | 'errors'
    > {}

const GeneralForm: React.FunctionComponent<IGeneralFormProps> = ({
  clusterList,
  storageList,
  errors,
  handleBlur,
  handleChange,
  isEdit,
  setFieldTouched,
  setFieldValue,
  touched,
  values,
}: IGeneralFormProps) => {
  const planNameInputRef = useRef(null);
  useEffect(() => {
    planNameInputRef.current.focus();
  }, []);

  const onHandleChange = (val, e) => handleChange(e);

  let srcClusterOptions: string[] = ['No valid clusters found'];
  let targetClusterOptions: string[] = [];
  let storageOptions: string[] = ['No valid storage found'];

  if (clusterList.length) {
    srcClusterOptions = clusterList
      .filter(
        (cluster) =>
          cluster.MigCluster.metadata.name !== values.targetCluster &&
          cluster.ClusterStatus.hasReadyCondition
      )
      .map((cluster) => cluster.MigCluster.metadata.name);

    targetClusterOptions = clusterList
      .filter(
        (cluster) =>
          cluster.MigCluster.metadata.name !== values.sourceCluster &&
          cluster.ClusterStatus.hasReadyCondition
      )
      .map((cluster) => cluster.MigCluster.metadata.name);
  }

  if (storageList.length) {
    storageOptions = storageList
      .filter((storage) => storage.StorageStatus.hasReadyCondition)
      .map((storage) => storage.MigStorage.metadata.name);
  }

  const handleStorageChange = (value, event) => {
    // console.log('value', value, 'event', event);
    // onHandleChange(value, event);
    // setFieldValue('selectedStorage', value, true);
    // setFieldTouched('selectedStorage', true, true);
    const matchingStorage = storageList.find((c) => c.MigStorage.metadata.name === value);
    if (matchingStorage) {
      // onHandleChange(value, event);
      setFieldValue('selectedStorage', value, true);
      setFieldTouched('selectedStorage', true, false);
    }
  };

  const handleSourceChange = (value) => {
    const matchingCluster = clusterList.find((c) => c.MigCluster.metadata.name === value);
    if (matchingCluster) {
      setFieldValue('sourceCluster', value, true);
      setFieldTouched('sourceCluster', true, false);
      // setFieldValue('selectedNamespaces', []);
      setFieldValue('sourceTokenRef', null, true);
      setFieldTouched('sourceTokenRef', true, false);
    }
  };

  const handleTargetChange = (value) => {
    const matchingCluster = clusterList.find((c) => c.MigCluster.metadata.name === value);
    if (matchingCluster) {
      setFieldValue('targetCluster', value, true);
      setFieldTouched('targetCluster', true, false);
      setFieldValue('targetTokenRef', null, true);
      setFieldTouched('targetTokenRef', true, false);
    }
  };
  console.log('rerender');
  return (
    <Form>
      <Title size="md" className={styles.fieldGridTitle}>
        Give your plan a name
      </Title>

      <Grid md={6} gutter="md" className={spacing.mbMd}>
        <GridItem>
          <FormGroup
            label="Plan name"
            isRequired
            fieldId="planName"
            helperTextInvalid={touched.planName && errors.planName}
            isValid={!(touched.planName && errors.planName)}
          >
            <TextInput
              ref={planNameInputRef}
              onChange={(val, e) => onHandleChange(val, e)}
              onInput={() => setFieldTouched('planName', true, true)}
              onBlur={handleBlur}
              value={values.planName}
              name="planName"
              type="text"
              isValid={!errors.planName && touched.planName}
              id="planName"
              isDisabled={isEdit}
            />
          </FormGroup>
        </GridItem>
      </Grid>

      <Title size="md" className={styles.fieldGridTitle}>
        Select source and target clusters
      </Title>

      <Grid md={6} gutter="md" className={spacing.mbMd}>
        <GridItem>
          <FormGroup
            label="Source cluster"
            isRequired
            fieldId="sourceCluster"
            helperTextInvalid={touched.sourceCluster && errors.sourceCluster}
            isValid={!(touched.sourceCluster && errors.sourceCluster)}
          >
            <SimpleSelect
              id="sourceCluster"
              onBlur={handleBlur}
              onChange={handleSourceChange}
              options={srcClusterOptions}
              value={values.sourceCluster}
              placeholderText="Select source..."
              // name="sourceCluster"
            />
          </FormGroup>
          <TokenSelect
            fieldId="sourceToken"
            clusterName={values.sourceCluster}
            value={values.sourceTokenRef}
            onChange={(tokenRef: INameNamespaceRef) => {
              setFieldValue('sourceTokenRef', tokenRef);
              setFieldTouched('sourceTokenRef', true, true);
            }}
            touched={touched.sourceTokenRef}
            error={errors.sourceTokenRef}
            expiringSoonMessage="The users's selected token on cluster source will expire soon."
            expiredMessage="The user's selected token on cluster source is expired."
          />
        </GridItem>

        <GridItem>
          <FormGroup
            label="Target cluster"
            isRequired
            fieldId="targetCluster"
            helperTextInvalid={touched.targetCluster && errors.targetCluster}
            isValid={!(touched.targetCluster && errors.targetCluster)}
          >
            <SimpleSelect
              id="targetCluster"
              onChange={handleTargetChange}
              onBlur={handleBlur}
              options={targetClusterOptions}
              value={values.targetCluster}
              placeholderText="Select target..."
            />
          </FormGroup>
          <TokenSelect
            fieldId="targetToken"
            clusterName={values.targetCluster}
            value={values.targetTokenRef}
            onChange={(tokenRef) => {
              setFieldValue('targetTokenRef', tokenRef);
              setFieldTouched('targetTokenRef', true, true);
            }}
            touched={touched.targetTokenRef}
            error={errors.targetTokenRef}
            expiringSoonMessage="The users's selected token on cluster target will expire soon."
            expiredMessage="The user's selected token on cluster target is expired."
          />
        </GridItem>
      </Grid>

      <Title size="md" className={styles.fieldGridTitle}>
        Select a replication repository
      </Title>

      <Grid md={6} gutter="md">
        <GridItem>
          <FormGroup
            label="Repository"
            isRequired
            fieldId="selectedStorage"
            helperTextInvalid={touched.selectedStorage && errors.selectedStorage}
            isValid={!(touched.selectedStorage && errors.selectedStorage)}
          >
            <SimpleSelect
              id="selectedStorage"
              onBlur={handleBlur}
              onChange={handleStorageChange}
              options={storageOptions}
              value={values.selectedStorage}
              placeholderText="Select repository..."
            />
          </FormGroup>
        </GridItem>
      </Grid>
    </Form>
  );
};

export default GeneralForm;
