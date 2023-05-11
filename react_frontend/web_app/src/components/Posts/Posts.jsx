import { PostItem } from "../PostItem/PostItem"

export const Posts = ({posts}) => {

    if (posts.length === 0) {
        return;
    }

    return (
        <div>
            {posts.map((b, index) => <PostItem
                    key = {`post-${b.id}-${index}`}
                    id = {b.id}
                    user = {b.user}
                    time = {b.time}
                    post = {b.post}
                />)}
        </div>
    )
}