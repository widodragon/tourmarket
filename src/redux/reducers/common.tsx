const initialState = {
    isLoading: false,
    isConnected: false,
    dataPassanger: {},
    defaultValuePassanger: {}
}
const common = (state = initialState, action: any) => {
    switch (action.type) {

        case 'GET_STATUS_INTERNET':
            return {
                ...state,
                isConnected: action.payload
            }
        case 'ADD_PASSANGER_DATA_FORM':
            return {
                ...state,
                dataPassanger: action.payload
            }
            case 'ADD_DEFAULT_VALUE_PASSANGER':
                return {
                    ...state,
                    defaultValuePassanger: action.payload
                }
        default:
            return state;
    }
}

export default common;
