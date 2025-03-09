import GigForm from '../components/gig/GigForm';

export default function CreateGig() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Create a New Project</h1>
      <GigForm />
    </div>
  );
}