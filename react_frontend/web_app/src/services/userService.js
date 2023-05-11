function setCurrentUser(name){
    localStorage.setItem('user', name);

}

function getCurrentUser() {
    const value = localStorage.getItem('user');
    return value;
} 


module.exports = {
    setCurrentUser,
    getCurrentUser
}