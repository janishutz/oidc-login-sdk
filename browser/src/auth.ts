export const login = () => {
    sessionStorage.setItem( 'redirect', location.pathname );
    location.href = '/login';
};

export const check = () => {};

export const logout = () => {};
