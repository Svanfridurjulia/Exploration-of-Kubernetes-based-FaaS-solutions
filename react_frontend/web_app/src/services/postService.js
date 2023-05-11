let postItems = [];

function addPostItem(value){
    postItems = getAllPostItems();
    postItems.unshift(value);
    localStorage.setItem('post', JSON.stringify(postItems));
    console.log(postItems);

}

function getAllPostItems() {
    const value = localStorage.getItem('post');
    return value ? JSON.parse(value) : [];
} 

function getAllUserPostItems (name) {
    postItems = getAllPostItems();
    postItems = postItems.filter((pi) => pi.user === name);
    console.log(postItems);
    return postItems;
}


module.exports = {
    getAllPostItems,
    addPostItem,
    getAllUserPostItems
}