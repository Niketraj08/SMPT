import React from 'react';
import Form from '../components/Form';

const Contact = () => {
  return (
    <section className="w-full max-w-3xl bg-white shadow-lg rounded-2xl overflow-hidden">
      <div className="bg-primary-600 text-white px-6 py-4">
        <h1 className="text-xl sm:text-2xl font-semibold">Contact Our Company</h1>
        <p className="text-sm text-primary-100 mt-1">
          Have a question or business enquiry? Fill out the form and we&apos;ll get back to you shortly.
        </p>
      </div>
      <div className="px-6 py-6 sm:px-8 sm:py-8">
        <Form />
      </div>
    </section>
  );
};

export default Contact;
