import axios from "axios";

function Login() {
  const onSubmit = async (event: any) => {
    event.preventDefault();

    const data = {
      email: event.target.email.value,
      password: event.target.password.value,
    };
    const win: Window = window;
    await axios
      .post("http://localhost:3333/login", data)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          localStorage.setItem("token", res.data.access_token);
          win.location = "/posts";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <form onSubmit={onSubmit} className="flex flex-col justify-center items-center w-auto h-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">Log In</h1>
        <div className="m-2">
          <input type="email" id="email" placeholder="test@gmail.com" required className="w-96 p-2 border-solid border-2 border-black rounded-lg drop-shadow-md" />
        </div>
        <div>
          <input type="password" id="password" placeholder="password" required className="w-96 p-2 border-solid border-2 border-black rounded-lg drop-shadow-md" />
        </div>
        <button id="login-btn" type="submit" className="m-2 p-2 w-96 bg-black rounded-lg hover:drop-shadow-xl">
          <span className="text-white">Log in</span>
        </button>
        <a href="/register" className="mt-3 underline">
          You don't have Account ? Pleses Register.
        </a>
      </form>
    </div>
  );
}

export default Login;
