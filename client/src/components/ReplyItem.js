import { useForm } from "react-hook-form";

export const ReplyItem = ({
  reply,
  comments,
  setComments,
  index,
  replyIndex,
}) => {
  const { register, handleSubmit } = useForm();

  const replyHandler = (data) => {
    const { replyId } = data;
    const userId = localStorage.getItem("userId");
    fetch(`/api/v1/upvote/${replyId}`, {
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
          class="inline-block h-12 w-12 rounded-full"
          src={reply.createdBy.profilePicture}
          alt={`${reply.createdBy.firstName} ${reply.createdBy.lastName}`}
        ></img>
              <div className="min-w-0 flex-1 text-left ">
          <div>
            <div className="text-sm">
                          <span className="font-medium text-gray-900">{reply.createdBy.firstName} {reply.createdBy.lastName}</span>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">{reply.createdAt}</p>
          </div>
          <div className="mt-2 text-sm text-gray-700">
            <p>{reply.content}</p>
          </div>
          <span class="relative z-0 flex gap-4 my-4">
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
              <span>{reply.upvotes.length} Upvote</span>
            </button>
            <button
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
        </div>
      </form>
    </li>
  );
};
