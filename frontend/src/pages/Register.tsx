import axios from "axios";

function Register() {
  const onSubmit = async (event: any) => {
    event.preventDefault();

    const data = {
      fname: event.target.fname.value,
      lname: event.target.lname.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };
    console.log("data: ", data);

    await axios
      .post("http://localhost:3333/register", data)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <form onSubmit={onSubmit} className="flex flex-col justify-center items-center w-auto h-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">Register</h1>
        <div className="m-2">
          <input type="text" id="fname" placeholder="First Name" required className="w-96 p-2 border-solid border-2 border-black rounded-lg drop-shadow-md" />
        </div>
        <div className="m-2">
          <input type="text" id="lname" placeholder="Last Name" required className="w-96 p-2 border-solid border-2 border-black rounded-lg drop-shadow-md" />
        </div>
        <div className="m-2">
          <input type="email" id="email" placeholder="Email" required className="w-96 p-2 border-solid border-2 border-black rounded-lg drop-shadow-md" />
        </div>
        <div>
          <input type="password" id="password" placeholder="Password" required className="w-96 p-2 border-solid border-2 border-black rounded-lg drop-shadow-md" />
        </div>
        <button id="register-btn" type="submit" className="m-2 p-2 w-96 bg-black rounded-lg hover:drop-shadow-xl">
          <span className="text-white">Register</span>
        </button>
        <a href="/login" className="mt-3 underline">
          But You have Account ? Pleses Log In.
        </a>
      </form>
    </div>
  );
}

export default Register;
