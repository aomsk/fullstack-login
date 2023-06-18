import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Posts() {
  type Post = {
    id: number;
    title: string;
    body: string;
    userId: number;
  };
  const [posts, setPosts] = useState<Post[] | null>();
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((res) => {
        console.log(res);
        setPosts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handelLogOut() {
    localStorage.removeItem("token");
    const win: Window = window;
    win.location = "/";
    navigate("/");
  }

  return (
    <div className="flex flex-col h-screen bg-white m-10">
      <div className="flex justify-end">
        <button id="logout-btn" type="submit" onClick={handelLogOut} className="m-2 p-2 bg-black rounded-lg hover:drop-shadow-xl">
          <span className="text-white">Log Out</span>
        </button>
      </div>
      {posts
        ? posts.map((post) => {
            return (
              <div key={post.id} className="drop-shadow-m bg-gray-200 m-2 p-5 h-1/2 rounded-lg">
                <h3 className="text-xl font-bold mb-3">
                  {post.id}. {post.title}
                </h3>
                <p>{post.body}</p>
              </div>
            );
          })
        : null}
    </div>
  );
}

export default Posts;
