import { useForm } from "react-hook-form";
import { ReplyItem } from "./ReplyItem";
import { useState } from "react";
export const CommentItem = ({ comment, comments, setComments, index }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
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
        const newComments = [...comments];
        newComments[index] = data;
        setComments(newComments);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const replyHandler = (data) => {
    const { commentId, reply } = data;
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
      });
  };
  return (
    <li class="px-4 py-4 sm:px-0 list-none relative flex items-start space-x-3">
      <div className="relative  pb-8">
        {comment.replies.length > 0 && (
          <span className="absolute top-12 mt-4 left-5 -ml-px h-full w-0.5 bg-gray-200"></span>
        )}

        <form class="grid grid-columns-2">
          <input
            type="hidden"
            name="commentId"
            defaultValue={comment._id}
            {...register("commentId")}
          />
          <div>
            {comment.createdBy && (
              <img
                class="inline-block h-12 w-12 rounded-full"
                src={comment.createdBy.profilePicture}
                alt={`${comment.createdBy.firstName} ${comment.createdBy.lastName}`}
              />
            )}
          </div>
          <div class="pl-3">
            <div class="flex items-center gap-4">
              <p
                class="
                        text-sm
                        font-medium
                        text-gray-700
                        group-hover:text-gray-900
                      "
              >
                {comment.createdBy.firstName} {comment.createdBy.lastName}
              </p>
              <p
                class="
                        text-xs
                        font-light
                        text-gray-500
                        group-hover:text-gray-700
                      "
              >
                {comment.createdAt}
              </p>
            </div>
            <p class="mt-1 text-sm text-gray-600 line-clamp-2 max-w-max">
              {comment.content}
            </p>
            <span class="relative z-0 flex gap-4 my-4">
              <button
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
                  class="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
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
                class="
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
                  class="
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
                  <div id="loading" class="hidden">
                    <svg
                      class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
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
                  .map((reply, replyIndex) => (
                    <ReplyItem
                      reply={reply}
                      replyIndex={replyIndex}
                      setComments={setComments}
                      comments={comments}
                      index={index}
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
