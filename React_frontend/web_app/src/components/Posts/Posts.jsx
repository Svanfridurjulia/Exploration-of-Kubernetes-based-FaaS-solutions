import { PostItem } from "../postItem/PostItem"

export const Posts = ({posts}) => {

    if (posts.length == 0) {
        return;
    }

    return (
        <div>
            {posts.map(b => <PostItem
                    key = {b.id}
                    id = {b.id}
                    user = {b.user}
                    time = {b.time}
                    post = {b.post}
                />)}
        </div>
    )
}