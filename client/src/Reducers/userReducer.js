export const initialState = JSON.parse(localStorage.getItem('user'));

export const reducer = (state, action) => {
  switch (action.type) {
    case 'USER':
      return action.payload;
    case 'CLEAR':
      return null;
    case 'UPDATE':
      return {
        ...state,
        followers: action.payload.followers,
        following: action.payload.following,
      };
    case 'UPDATEDP':
      return {
        ...state,
        dp: action.payload,
      };
    default:
      return state;
  }
};