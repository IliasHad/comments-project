import { useForm } from "react-hook-form";
import { ReplyItem } from "./ReplyItem";
import { useState } from "react";
import { timeSince } from "../utils/index";
export const CommentItem = ({ comment, comments, setComments }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const upvoteHandler = (data) => {
    const { commentId } = data;
    console.log(data);
    const userId = localStorage.getItem("userId");
    fetch(`/api/v1/upvote/${commentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ createdBy: userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const index = comments.findIndex((el) => el._id === comment._id);
        const newComments = [...comments];

        newComments[index] = data;
        setComments(newComments);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const replyHandler = (data) => {
    setLoading(true);
    const { commentId, reply } = data;
    const index = comments.findIndex((comment) => comment._id === commentId);
    console.log(data);
    const userId = localStorage.getItem("userId");
    fetch(`/api/v1/comment/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ createdBy: userId, content: reply }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const newComments = [...comments];
        newComments[index] = data;
        setSelectedComment(null);
        setComments(newComments);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };
  return (
    <li className="px-4 py-4 sm:px-0 list-none relative flex items-start space-x-3">
      <div className="relative  pb-8">
        {comment.replies.length > 0 && (
          <span className="absolute top-12 mt-4 left-5 -ml-px h-full w-0.5 bg-gray-200"></span>
        )}

        <form className="grid grid-columns-2">
          <input
            type="hidden"
            name="commentId"
            defaultValue={comment._id}
            {...register("commentId")}
          />
          <div>
            {comment.createdBy && (
              <img
                className="inline-block h-12 w-12 rounded-full"
                src={comment.createdBy.profilePicture}
                alt={`${comment.createdBy.firstName} ${comment.createdBy.lastName}`}
              />
            )}
          </div>
          <div className="pl-3">
            <div className="flex items-center gap-4">
              <p
                className="
                        text-sm
                        font-medium
                        text-gray-700
                        group-hover:text-gray-900
                      "
              >
                {comment.createdBy.firstName} {comment.createdBy.lastName}
              </p>
              <p
                className="
                        text-xs
                        font-light
                        text-gray-500
                        group-hover:text-gray-700
                      "
              >
                {timeSince(new Date(comment.createdAt))}
              </p>
            </div>
            <p className="mt-1 text-sm text-gray-600 line-clamp-2 max-w-max">
              {comment.content}
            </p>
            <span className="relative z-0 flex gap-4 my-4">
              <button
                disabled={loading}
                onClick={handleSubmit(upvoteHandler)}
                className={`  relative
                        flex
                        gap-2
                        items-center
                        px-4
                        py-2
                        text-sm
                        font-medium ${
                          comment.upvotes.filter(
                            (upvote) =>
                              upvote.createdBy ===
                              localStorage.getItem("userId")
                          ).length > 0
                            ? "text-white bg-indigo-600"
                            : "hover:bg-gray-50 text-gray-500"
                        }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                <span>{comment.upvotes.length} Upvote</span>
              </button>
              <button
                onClick={() =>
                  comment._id === selectedComment
                    ? setSelectedComment(null)
                    : setSelectedComment(comment._id)
                }
                type="button"
                className="
                        -ml-px
                        relative
                        inline-flex
                        items-center
                        px-2
                        py-2
                        text-sm
                        font-medium
                        text-gray-500
                        hover:bg-gray-50
                      "
              >
                Reply
              </button>
            </span>
            {comment._id === selectedComment && (
              <div className="flex gap-2">
                <input
                  {...register("reply", { required: true, minLength: 2 })}
                  type="text"
                  name="reply"
                  id="reply"
                  className={`
                  shadow-sm
                  block
                  w-full
                  sm:text-sm
                  ${
                    errors.text
                      ? "ring-red-500 border-red-500"
                      : "focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                  }
                `}
                  placeholder="What are your thoughts ?"
                />
                <button
                  onClick={handleSubmit(replyHandler)}
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
                  Reply
                </button>
              </div>
            )}
            {comment.replies.length > 0 && (
              <ul className="pt-4">
                {comment.replies
                  .sort((a, b) =>
                    b.upvotes.length < a.upvotes.length ? -1 : 1
                  )
                  .map((reply) => (
                    <ReplyItem
                      key={reply._id}
                      reply={reply}
                      setComments={setComments}
                      comments={comments}
                      parentCommentId={comment._id}
                    />
                  ))}
              </ul>
            )}
          </div>
        </form>
      </div>
    </li>
  );
};
