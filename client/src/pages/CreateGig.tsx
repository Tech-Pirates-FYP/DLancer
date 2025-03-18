import { useEffect, useState } from 'react';
import GigForm from '../components/gig/GigForm';
import { ToastContainer, toast } from 'react-toastify';
import { useCreateGigMutation } from '@/features/gig/gigAPI';

export default function CreateGig() {


  return (
    <div className="gap_section  mx-auto px-4 sm:px-6 lg:px-8 py-8">    
      <h1 className="text-2xl font-bold mb-6">Create a New Project</h1>
      <GigForm />
    </div>
  );
}