import * as user from './user.actions';

export interface UserState {
    username: string;
    email: string;
    initials: string;
    spId: number;
    isRegistered: boolean;
    name: string;
    surname: string;
    nameSurname: string;
    surnameName: string;
    photo: string;
    location: string;
}

const initialState: UserState = {
    username: null,
    email: null,
    initials: null,
    spId: null,
    isRegistered: null,
    name: null,
    surname: null,
    nameSurname: null,
    surnameName: null,
    photo: null,
    location: null
};

export function reducer(state = initialState, action: user.Actions): UserState {

    switch (action.type) {

        case user.SET_CURRENT_USER:
            return {
                ...state,
                ...action.payload
            };

        case user.SET_OPTIMUS_USER:
            console.log('triggerred?');
            return {
                ...state,
                ...action.payload
            };

        default:
            return state;
    }
}