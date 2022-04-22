import { useForm } from "react-hook-form";
import { useState } from "react";
export const CommentForm = ({ user, setComments, comments }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const onSubmit = (data) => {
    setLoading(true);
    const userId = localStorage.getItem("userId");
    const { text } = data;
    fetch("/api/v1/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: text,
        createdBy: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setComments([...comments, data]);
        reset()
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-columns-3 my-4 gap-4"
    >
      {errors.text && (
        <span className="text-sm text-red-500 mt-2 col-span-3">
          This field is required
        </span>
      )}
      <div id="profile_image">
        {user && (
          <img
            className="inline-block h-10 w-10 rounded-full"
            src={user.profilePicture}
            alt={`${user.firstName} ${user.lastName}`}
          />
        )}
      </div>

      <label
        htmlFor="text"
        className="hidden sr-only text-sm font-medium text-gray-700"
      >
        Text
      </label>
      <div className="mt-1 w-full">
        <input
          {...register("text", { required: true, minLength: 2 })}
          type="text"
          name="text"
          id="text"
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
      </div>

      <button
        id="submit"
        type="submit"
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
        Comment
      </button>
    </form>
  );
};
