import React, { useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import axios from 'axios';
import IssueItem from './IssueItem';
import NoticeEmpty from '../../common/NoticeEmpty';

import {
  ResolveDispatchContext,
  ResolveStateContext,
} from '../../../context/ResolveProvider';
import { IssuesStateContext } from '../../../context/IssuesProvider';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: theme.spacing(3),
    backgroundColor: 'rgba(89,89,89,0.3)',
  },
  controller: {
    gridColumnEnd: 'span 5',
    textAlign: 'center',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '3rem',
  },
  resolveButton: {
    marginLeft: '1.25rem',
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
    backgroundColor: 'rgba(50,50,50,0.2)',
    textTransform: 'none',
    color: 'white',
  },
  controllerItem: {
    marginLeft: '1.25rem',
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  IssueInfoItem: {
    flex: '1',
    width: '100%',
  },
  graph: {
    gridColumnEnd: 'span 3',
    textAlign: 'center',
    margin: '0 auto',
    marginTop: '1rem',
    marginBottom: '1rem',
    color: 'white',
  },
  column: {
    gridColumnEnd: 'span 2',
    textAlign: 'center',
    margin: '0 auto',
    marginTop: '1rem',
    marginBottom: '1rem',
    color: 'white',
  },
}));

const TableColumn = () => {
  const classes = useStyles();
  const resolveDispatch = useContext(ResolveDispatchContext);
  const resolveState = useContext(ResolveStateContext);
  const issues = useContext(IssuesStateContext);

  const handleCheckedAll = event => {
    const itemCheckBox = document.querySelectorAll('.item_checkbox');
    itemCheckBox.forEach(checkbox => {
      (checkbox as HTMLInputElement).checked = event.target.checked
        ? true
        : false;
    });

    if (event.target.checked) {
      issues.forEach(issue => {
        resolveDispatch({
          type: 'add',
          issueId: issue._id,
          projectId: issue.projectId,
        });
      });
    } else {
      resolveDispatch({ type: 'removeAll' });
    }
  };

  const handleChecked = event => {
    const checkbox = event.target;

    if (checkbox.checked) {
      if (!resolveState.includes(checkbox.id)) {
        resolveDispatch({ type: 'add', issueId: checkbox.id });
      }
    } else if (resolveState.includes(checkbox.id)) {
      resolveDispatch({ type: 'remove', issueId: checkbox.id });
    }
  };

  const handleResolve = () => {
    const updateIssuesResolve = async () => {
      await axios.put(
        `${process.env.API_URL}/issue/resolved`,
        { issueIdList: resolveState, resolved: true },
        {
          withCredentials: true,
        }
      );
    };

    updateIssuesResolve();
  };

  if (issues.length === 0) {
    return <NoticeEmpty type="issues" />;
  }

  return (
    <div>
      <div className={classes.container}>
        <div className={classes.controller}>
          <input
            type="checkbox"
            className={classes.controllerItem}
            onClick={handleCheckedAll}
          />
          <Button
            variant="contained"
            className={classes.resolveButton}
            startIcon={<DoneIcon />}
            id="Resolved_button"
            disabled={resolveState.length <= 0}
            onClick={handleResolve}
          >
            Resolve
          </Button>
        </div>
        <div className={classes.graph}>Graph: 14d</div>
        <div className={classes.column}>Events</div>
        <div className={classes.column}>Assigned</div>
      </div>
      {issues.map(issue => (
        <IssueItem key={issue._id} issue={issue} onClick={handleChecked} />
      ))}
    </div>
  );
};

export default TableColumn;
