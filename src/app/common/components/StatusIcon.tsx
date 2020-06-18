import React from 'react';
import {
  CheckCircleIcon,
  WarningTriangleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
const styles = require('./StatusIcon.module');

export enum StatusType {
  OK = 'OK',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

interface IProps {
  status: StatusType;
  isDisabled?: boolean;
  className?: string;
}

const StatusIcon: React.FunctionComponent<IProps> = ({
  status,
  isDisabled,
  className = '',
}: IProps) => {
  if (status === StatusType.OK) {
    return (
      <span className={`pf-c-icon pf-m-success ${className}`}>
        <CheckCircleIcon className={isDisabled && styles.disabled} />
      </span>
    );
  }
  if (status === StatusType.WARNING) {
    return (
      <span className={`pf-c-icon pf-m-warning ${className}`}>
        <WarningTriangleIcon className={isDisabled && styles.disabled} />
      </span>
    );
  }
  if (status === StatusType.ERROR) {
    return (
      <span className={`pf-c-icon pf-m-danger ${className}`}>
        <ExclamationCircleIcon className={isDisabled && styles.disabled} />
      </span>
    );
  }
  return null;
};

export default StatusIcon;
