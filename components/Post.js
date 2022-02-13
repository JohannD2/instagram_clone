import {
    BookmarkIcon,
    ChatIcon,
    DotsHorizontalIcon,
    EmojiHappyIcon,
    HeartIcon,
    PaperAirplaneIcon
} from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import {
    HeartIcon as HeartIconsFilled
} from '@heroicons/react/solid';
import { addDoc, collection, serverTimestamp, onSnapshot, query, orderBy, setDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useSession } from 'next-auth/react';
import Moment from 'react-moment';


const Post = ({id, username, userImg, img, caption}) => {

    const[comments, setComments] = useState([]);
    const[comment, setComment] = useState("");
    const[likes, setLikes] = useState([]);
    const[hasLike, setHasLike] = useState(false);

    const { data:session } = useSession();

    const sendComment = async (e) => {
        e.preventDefault();

        const commentToSend = comment;
        setComment("");
        
        await addDoc(collection(db, "posts", id, "comments"), {
            comment: commentToSend,
            username: session.user.username,
            userImage: session.user.image,
            timestamp: serverTimestamp()
        })
    }

    const likePost = async () => {

        if(hasLike)
        {
            await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
        }
        else 
        {
            await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
                username: session.user.username
            });
        }
    }

    useEffect(() => 
        onSnapshot(
            query(
                collection(db, "posts", id, "likes")
            ),
            (snapshot) => setLikes(snapshot.docs)
        )
    , [db, id]);

    useEffect(() => 
        onSnapshot(
            query(
                collection(db, "posts", id, "comments"),
                orderBy("timestamp", "desc")
            ),
            (snapshot) => setComments(snapshot.docs)
        )
    , [db, id]);

    useEffect(() => {
        setHasLike(likes.findIndex((like) => (like.id === session?.user?.uid)) !== -1)
    }, [likes]);

    return (
        <div className="bg-white my-7 border rounded-sm">

            <div className="flex items-center p-5 ">
                <img 
                    src={session?.user.image}
                    className="h-12 w-12 rounded-full object-contain border p-1 mr-3"
                    alt="user-img"
                />
                <p className="flex-1 font-bold">{username}</p>
                <DotsHorizontalIcon
                    className="h-5"
                />
            </div>

            <img 
                src={img} 
                className="object-cover w-full"
                alt="post-img"
            />

            <div className="flex justify-between px-4 pt-4">
                <div className="flex space-x-4">
                    {
                        hasLike
                        ?
                        <HeartIconsFilled
                            onClick={likePost}
                            className="btn text-red-500"
                        />
                        :
                        <HeartIcon 
                            onClick={likePost}
                            className="btn"
                        />
                    }
                    <ChatIcon className="btn" />
                    <PaperAirplaneIcon className="btn rotate-45" />
                </div>
                <BookmarkIcon className="btn" />
            </div>

            <p className="p-5 truncate">
                {
                    likes.length > 0 && (
                        <p className="font-bold mb-1">{likes.length} likes</p>
                    )
                }
                <span className="font-bold mr-2">{username}</span>
                {caption}
            </p>

            {
                comments.length > 0 && (
                    <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
                        {comments.map((comment) => (
                            <div className="flex items-center space-x-2 mb-3" key={comment.id}>
                                <img src={comment.data().userImage} className="h-7 rounded-full" alt=""/>
                                <p className="text-sm flex-1">
                                    <span className="font-bold">{comment.data().username} </span>
                                    {comment.data().comment}
                                </p>
                                <Moment fromNow className="pr-5 text-xs">
                                    {comment.data().timestamp?.toDate()}
                                </Moment>
                            </div>
                        ))}
                    </div>
                )
            }
        
            <form className="flex items-center p-4">
                <EmojiHappyIcon className="h-7"/>
                <input 
                    className="border-none flex-1 focus:ring-0 outline-none" 
                    placeholder="Add a comment..." 
                    type="text"
                    value={comment}
                    onChange={(e) => {setComment(e.target.value)}}
                />
                <button 
                    type="submit" 
                    disabled={!comment.trim()} 
                    className="font-semibold text-blue-400"
                    onClick={sendComment}
                >Post</button>
            </form>
        </div>
    )
}

export default Post