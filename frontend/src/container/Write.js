import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Loading from '../component/Loading';
import Writer from '../component/Writer';

import { getRole } from '../action/user';
import { adminRole, staffRole, userRole, defaultRole } from '../settings';

function Write(props) {
  // requires at least user
  const history = useHistory();
  const { role, getRole } = props;
  useEffect(() => {
    getRole();
  }, [getRole]);
  useEffect(() => {
    const user = (role === adminRole || role === staffRole || role === userRole);
    if (role !== defaultRole && !user) {
      history.push('/');
    }
  }, [role, history]);

  return (
    role === defaultRole
      ? <Loading />
      : <Writer />
  );
}

const mapStateToProps = (state) => ({
  role: state.user.role,
});

const mapDispatchToProps = (dispatch) => ({
  getRole: () => dispatch(getRole()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Write);
