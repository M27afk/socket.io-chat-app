import { BrowserRouter, Routes, Route } from "react-router-dom";
import socketIO from "socket.io-client";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import Home from "./components/Home";

const clerkPubKey = import.meta.env.VITE_PUBLISHABLE_KEY;
const socket = socketIO.connect("http://localhost:4000");

export default function App() {
  return (
    <BrowserRouter>
      <ClerkProvider publishableKey={clerkPubKey}>
        <Routes>
          <Route
            path="/*"
            element={
              <>
                <SignedIn>
                  <Home socket={socket} />
                </SignedIn>
                <SignedOut>
                  <div className="login">
                    <SignIn
                      path="/"
                      routing="path"
                      signUpUrl="/register"
                      afterSignInUrl="/chat"
                    />{" "}
                  </div>
                </SignedOut>
              </>
            }
          />

          <Route
            path="/register/*"
            element={
              <div className="login">
                <SignUp afterSignUpUrl="/chat" />
              </div>
            }
          />

          <Route
            path="/chat"
            element={
              <>
                <SignedIn>
                  <Home socket={socket} />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </ClerkProvider>
    </BrowserRouter>
  );
}
