import { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadAIVoice, generateAIVoice } from "./lib/upload";

const PLAY = "PLAY";
const STOP = "STOP";

function App() {
  const [status, setStatus] = useState(STOP);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const audio = useRef([]);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);

  const notify = (message) => toast(message);

  const handleListening = () =>
    setStatus((status) => (status === PLAY ? STOP : PLAY));

  const uploadAudio = async (blob) => {
    setLoading(true);
    notify("Uploading audio... Please wait.");
    const file = new File([blob], "audio.mp3", { type: blob.type });

    try {
      const audio = await generateAIVoice(file);
      await uploadAIVoice(audio);
      setUploadStatus("Success");
      notify("Audio uploaded successfully!");
    } catch (error) {
      notify("Error during audio upload.\nPlease try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const processing = async () => {
      if (status === PLAY) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          streamRef.current = stream;
          recorderRef.current = new MediaRecorder(stream);

          recorderRef.current.ondataavailable = (event) => {
            audio.current.push(event.data);
          };

          recorderRef.current.onstop = async () => {
            const audioBlob = new Blob(audio.current, {
              type: "audio/mp3",
            });

            if (audioBlob.size > 0) {
              await uploadAudio(audioBlob);
              setError(null);
            } else {
              setError("No audio data captured");
            }
          };

          recorderRef.current.start();
          audio.current = [];
        } catch (error) {
          setError(
            "Failed to start recording. Please ensure microphone access."
          );
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
  }, [status]);

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
                <Loader />
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

function Loader(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
      className="w-7 h-7 backdrop-filter text-purple-50"
    >
      <path d="M18.364 5.636L16.95 7.05A7 7 0 1019 12h2a9 9 0 11-2.636-6.364z" />
    </svg>
  );
}
