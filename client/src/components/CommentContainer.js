import { CommentForm } from "./CommentForm";
import { useEffect, useState, useCallback } from "react";
import { CommentItem } from "./CommentItem";
import { io } from "socket.io-client";

export const CommentContainer = () => {
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const socket = io.connect(process.env.REACT_APP_SEVER_HOST);
  socket.on("connect", () => {
    console.log(socket.id);
  });

  const handleNewUpvote = useCallback(
    ({ comment, parentCommentId }) => {
      if (comment && comment._id && comments.length > 0) {
        const newComments = [...comments];

        if (parentCommentId) {
          const index = newComments.findIndex(
            (comment) => comment._id === parentCommentId
          );
          const replyIndex = newComments[index].replies.findIndex(
            (el) => el._id === comment._id
          );

          newComments[index].replies[replyIndex] = comment;
        } else {
          const index = newComments.findIndex((el) => el._id === comment._id);

          newComments[index] = comment;
        }
        setComments(newComments);
      }
    },
    [comments]
  );
  socket.on("upvote", handleNewUpvote.bind(socket));

  useEffect(() => {
    // as soon as the component is mounted, do the following tasks:

    // emit USER_ONLINE event

    // subscribe to socket events
    socket.on("upvote", handleNewUpvote);

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off("upvote", handleNewUpvote);
    };
  }, [socket, handleNewUpvote]);
  useEffect(() => {
    async function getComments() {
      fetch("/api/v1/comment/all", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setComments(data);
        })
        .catch((err) => {
          console.error(err);
        });
    }

    async function getUser() {
      fetch(`/api/v1/user/${localStorage.getItem("userId")}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((user) => {
          setUser(user);
          localStorage.setItem("userId", user._id);
        })
        .catch((err) => {
          console.error(err);
        });
    }
    getComments();
    getUser();
  }, []);
  const handleRandomUser = () => {
    setLoading(true);
    fetch(`api/v1/user/random/${localStorage.getItem("userId")}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then(({ user }) => {
        setUser(user);
        localStorage.setItem("userId", user._id);
        setComments(comments);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };
  return (
    <div className="relative py-16 bg-white overflow-hidden">
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="text-lg max-w-prose mx-auto">
          <div className="my-4">
            <button
              onClick={handleRandomUser}
              className="
                inline-flex
                items-center
                px-2.5
                py-1.5
                border border-transparent
                text-xs
                font-medium
                rounded
                shadow-sm
                text-white
                bg-indigo-600
                hover:bg-indigo-700
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-indigo-500
              "
            >
              {loading && (
                <div>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
              Randomize user
            </button>
          </div>
          <h1 className="font-bold text-left">Discussions</h1>
          <CommentForm
            user={user}
            setComments={setComments}
            comments={comments}
          />
          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
          </div>
          <ul>
            {comments
              .sort((a, b) => (b.upvotes.length < a.upvotes.length ? -1 : 1))
              .map((comment, index) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  setComments={setComments}
                  comments={comments}
                />
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
