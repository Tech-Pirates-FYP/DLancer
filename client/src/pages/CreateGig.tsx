import { useState } from 'react';
import GigForm from '../components/gig/GigForm';
import { ToastContainer, toast } from 'react-toastify';
import { useCreateGigMutation } from '@/features/gig/gigAPI';

export default function CreateGig() {

  const [ success, setSuccess ] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {success && toast.success("Successfully posted gig!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })}

      <ToastContainer aria-label={undefined} />

      <h1 className="text-2xl font-bold mb-6">Create a New Project</h1>
      <GigForm onSuccess={setSuccess}/>
    </div>
  );
}