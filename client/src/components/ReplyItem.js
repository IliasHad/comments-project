import { useForm } from "react-hook-form";
import { timeSince } from "../utils/index";

export const ReplyItem = ({
  reply,
  comments,
  setComments,
  parentCommentId,
}) => {
  const { register, handleSubmit } = useForm();

  const replyHandler = (data) => {
    const { replyId } = data;
    const index = comments.findIndex(
      (comment) => comment._id === parentCommentId
    );
    const userId = localStorage.getItem("userId");
    fetch(`/api/v1/upvote/${replyId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        createdBy: userId,
        parentCommentId: comments[index]._id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const replyIndex = comments[index].replies.findIndex(
          (el) => el._id === replyId
        );
        const newComments = [...comments];
        newComments[index].replies[replyIndex] = data;
        setComments(newComments);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <li>
      <form className="flex mb-4 gap-4">
        <input
          type="hidden"
          name="commentId"
          defaultValue={reply._id}
          {...register("replyId")}
        />
        <img
          className="inline-block h-12 w-12 rounded-full"
          src={reply.createdBy.profilePicture}
          alt={`${reply.createdBy.firstName} ${reply.createdBy.lastName}`}
        ></img>
        <div className="min-w-0 flex-1 text-left ">
          <div className="flex gap-4">
            <div className="text-sm">
              <span className="font-medium text-gray-900">
                {reply.createdBy.firstName} {reply.createdBy.lastName}
              </span>
            </div>
            <p
              className="
                        text-xs
                        font-light
                        text-gray-500
                        group-hover:text-gray-700
                      "
            >
              {timeSince(new Date(reply.createdAt))}
            </p>
          </div>
          <div className="mt-2 text-sm text-gray-700">
            <p>{reply.content}</p>
          </div>
          <span className="relative z-0 flex gap-4 my-4">
            <button
              onClick={handleSubmit(replyHandler)}
              type="submit"
              className={`  relative
                        flex
                        gap-2
                        items-center
                        px-4
                        py-2
                        text-sm
                        font-medium ${
                          reply.upvotes.filter(
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
              <span>{reply.upvotes.length} Upvote</span>
            </button>
            <button
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
        </div>
      </form>
    </li>
  );
};
