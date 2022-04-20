import { CommentForm } from "./CommentForm";
import { useEffect, useState } from "react";
import { CommentItem } from "./CommentItem";
export const CommentContainer = () => {
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
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
    return setComments([]);
  }, []);
  return (
    <div class="relative py-16 bg-white overflow-hidden">
      <div class="relative px-4 sm:px-6 lg:px-8">
        <div class="text-lg max-w-prose mx-auto">
          <h1 class="font-bold text-left">Discussions</h1>
          <CommentForm
            user={user}
            setComments={setComments}
            comments={comments}
          />
          <div class="relative py-8">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-300"></div>
            </div>
          </div>
          <ul>
            {comments
              .sort((a, b) => (b.upvotes.length < a.upvotes.length ? -1 : 1))
              .map((comment, index) => (
                <CommentItem
                  comment={comment}
                  setComments={setComments}
                  comments={comments}
                  index={index}
                />
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
