export const setConnection = (status: any) => {
  return {
    type: 'GET_STATUS_INTERNET',
    payload: status
  }
}

export const setPassangerDataForm = (props: any) => {
  return props.dispatch(
    {
      type: 'ADD_PASSANGER_DATA_FORM',
      payload: props.body,
    }
  );
}

export const setDefaultValuePassanger = (props: any) => {
  return props.dispatch(
    {
      type: 'ADD_DEFAULT_VALUE_PASSANGER',
      payload: props.body,
    }
  );
}