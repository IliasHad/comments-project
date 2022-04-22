const fetchComments = () => {
  fetch('/api/v0/comment/all', {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        const comment = data[i];
        const item = `     <li class="px-4 py-4 sm:px-0 list-none">
              <form id="upvote" class="grid grid-columns-2">
              <input type="hidden" name="commentId" value="${comment._id}" />
                <div>
                  <img
                    class="inline-block h-12 w-12 rounded-full"
                    src="${comment.createdBy.profilePicture}"
                    alt=""
                  />
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
                     ${comment.createdBy.firstName} ${
  comment.createdBy.lastName
}
                    </p>
                    <p
                      class="
                        text-xs
                        font-light
                        text-gray-500
                        group-hover:text-gray-700
                      "
                    >
                      ${timeSince(new Date(comment.createdAt))}
                    </p>
                  </div>
                  <p class="mt-1 text-sm text-gray-600 line-clamp-2 max-w-max">
                     ${comment.content}
                  </p>
                  <span class="relative z-0 flex gap-4 my-4">
                    <button
                      type="submit"
                      class="
                        relative
                        flex
                        gap-2
                        items-center
                        px-4
                        py-2
                        text-sm
                        font-medium
                        ${
  comment.upvotes.filter(
    (upvote) => upvote.createdBy
                              === localStorage.getItem('userId')
  ).length > 0
    ? 'text-white bg-indigo-600 '
    : 'hover:bg-gray-50 text-gray-500'
}
                        
                      "
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
                        <span>${comment.upvotes.length} Upvote</span>
                      </svg>
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

`;

        document.querySelector('#list').insertAdjacentHTML('beforeend', item);
      }
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => upvoteCommentHandler(localStorage.getItem('userId')));
};
const fetchUserProfilePicture = (userId) => {
  fetch(`/api/v0/user/${userId}`, {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((user) => {
      if (user.random) {
        localStorage.setItem('userId', user._id);
      }
      const item = `<img class="inline-block h-10 w-10 rounded-full" src="${user.profilePicture}" alt="${user.firstName} ${user.lastName}">`;
      document
        .querySelector('#profile_image')
        .insertAdjacentHTML('beforeend', item);
    })
    .catch((err) => {
      console.error(err);
    });
};
const addNewCommentHandler = (userId) => {
  const form = document.getElementById('comment');

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const formData = new FormData(form);
    if (formData.get('text')) {
      document.getElementById('submit').disabled = true;
      document.getElementById('loading').classList.add('block');
      document.getElementById('loading').classList.remove('hidden');
      fetch('/api/v0/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          createdBy: userId,
          content: formData.get('text'),
        }),
      })
        .then((response) => {
          document.querySelector('#list').innerHTML = null;

          fetchComments();
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          document.getElementById('loading').classList.add('hidden');
          document.getElementById('loading').classList.remove('block');
          document.getElementById('submit').disabled = false;
        });
    }
  });
};
const upvoteCommentHandler = (userId) => {
  Array.from(document.querySelectorAll('#upvote')).forEach((form) => {
    form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      const formData = new FormData(form);
      if (formData.get('commentId')) {
        fetch(
          `/api/v0/upvote/${formData.get('commentId')}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ createdBy: userId }),
          }
        )
          .then((response) => {
            document.querySelector('#list').innerHTML = null;
            fetchComments();
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('loading').classList.remove('block');
            document.getElementById('submit').disabled = false;
          });
      }
    });
  });
};
function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return `${Math.floor(interval)} years ago`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)} months ago`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)} days ago`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)} hours ago`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)} minutes ago`;
  }
  return `${Math.floor(seconds)} seconds`;
}

document.addEventListener('DOMContentLoaded', () => {
  const userId = localStorage.getItem('userId');
  fetchComments();
  fetchUserProfilePicture(userId);
  addNewCommentHandler(userId);
});
