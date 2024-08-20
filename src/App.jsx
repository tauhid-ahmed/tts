import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { uploadAIVoice, generateAIVoice } from "./lib/upload";
import { LoaderIcon } from "./components/Icons";
import "react-toastify/dist/ReactToastify.css";

const PLAY = "PLAY";
const STOP = "STOP";

function App() {
  const [state, setState] = useState({
    status: STOP,
    loading: false,
    error: null,
  });

  const audioRef = useRef([]);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);

  const notify = (message) => toast(message);

  const handleListening = () =>
    setState((prevState) => ({
      ...prevState,
      status: prevState.status === PLAY ? STOP : PLAY,
    }));

  const uploadAudio = async (blob) => {
    setState((prevState) => ({ ...prevState, loading: true }));
    notify("Uploading audio... Please wait.");
    const file = new File([blob], "audio.mp3", { type: blob.type });

    try {
      const audio = await generateAIVoice(file);
      await uploadAIVoice(audio);
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: null,
      }));
      notify("Audio uploaded successfully!");
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: "Error during audio upload. Please try again.",
      }));
      notify("Error during audio upload. Please try again.");
    }
  };

  useEffect(() => {
    const processing = async () => {
      const { status } = state;

      if (status === PLAY) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          streamRef.current = stream;
          recorderRef.current = new MediaRecorder(stream);

          recorderRef.current.ondataavailable = (event) => {
            audioRef.current.push(event.data);
          };

          recorderRef.current.onstop = async () => {
            const audioBlob = new Blob(audioRef.current, {
              type: "audio/mp3",
            });

            if (audioBlob.size > 0) {
              await uploadAudio(audioBlob);
              setState((prevState) => ({ ...prevState, error: null }));
            } else {
              const errorMessage = "No audio data captured";
              setState((prevState) => ({
                ...prevState,
                error: errorMessage,
              }));
              notify(errorMessage);
            }
          };

          recorderRef.current.start();
          audioRef.current = [];
        } catch (error) {
          const errorMessage =
            "Failed to start recording. Please ensure microphone access.";
          setState((prevState) => ({
            ...prevState,
            error: errorMessage,
          }));
          notify(errorMessage);
        }
      } else if (status === STOP && recorderRef.current) {
        recorderRef.current.stop();
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      }
    };

    processing();

    return () => {
      if (recorderRef.current) {
        recorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [state.status]);

  const { status, loading } = state;

  return (
    <>
      <div className="min-h-screen grid place-items-center font-inter bg-gray-200">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-6xl mb-7 font-semibold text-purple-600">
            Text to Speech
          </h1>
          <button
            className={`px-6 py-2 min-w-48 min-h-12 rounded text-white relative hover:bg-purple-600/90 transition-colors shadow overflow-hidden ${
              loading ? "bg-purple-600/70 pointer-events-none" : "bg-purple-600"
            }`}
            onClick={handleListening}
            disabled={loading}
          >
            {loading ? (
              <span className="absolute inset-0 flex items-center justify-center animate-loading">
                <LoaderIcon />
              </span>
            ) : (
              <span className="absolute inset-0 flex items-center justify-center">
                {status === PLAY ? "Stop Listening" : "Start Listening"}
              </span>
            )}
          </button>
        </div>
      </div>
      <ToastContainer autoClose={2000} />
    </>
  );
}

export default App;
