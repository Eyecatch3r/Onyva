import React, { useEffect, useState } from "react";
import { Link, redirect } from "react-router-dom";
const AuthSelection = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    // Get the modal element by ID and show it
    const modal = document.getElementById("my_modal_5");
    if (modal) {
      modal.showModal();
    }
  }, []);

  return (
    <div>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Please Log in or Sign up for onYva
          </h3>
          <div className="modal-action justify-start">
            <form method="dialog">
              <button className="btn m-3">
                <Link to={"/login"}>Log in</Link>
              </button>
              <button className="btn">
                <Link to={"/Signup"}>Sign Up</Link>
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AuthSelection;
