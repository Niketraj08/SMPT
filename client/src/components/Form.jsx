import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

const defaultValues = {
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const Form = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post('/api/send-mail', data);

      if (response.data?.success) {
        toast.success('Your message has been sent successfully.');
        reset(defaultValues);
      } else {
        toast.error(response.data?.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Unable to send your message at the moment. Please try again later.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            placeholder="John Doe"
            {...register('fullName', {
              required: 'Full name is required',
              minLength: { value: 2, message: 'Full name must be at least 2 characters' },
              maxLength: { value: 100, message: 'Full name must be at most 100 characters' },
            })}
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            placeholder="you@example.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address',
              },
            })}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="phone">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            placeholder="+1 123-4567"
            {...register('phone', {
              required: 'Phone number is required',
              minLength: { value: 6, message: 'Phone number looks too short' },
              maxLength: { value: 20, message: 'Phone number looks too long' },
            })}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="subject">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            placeholder="How can we help you?"
            {...register('subject', {
              required: 'Subject is required',
              maxLength: { value: 150, message: 'Subject must be at most 150 characters' },
            })}
          />
          {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-y"
          placeholder="Please provide as many details as possible..."
          {...register('message', {
            required: 'Message is required',
            minLength: { value: 10, message: 'Message must be at least 10 characters' },
            maxLength: { value: 2000, message: 'Message must be at most 2000 characters' },
          })}
        />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
      </div>

      <div className="pt-2 flex items-center justify-between gap-4 flex-col sm:flex-row">
        <p className="text-xs text-slate-500 text-left w-full sm:w-auto">
          We respect your privacy. Your information will only be used to respond to your enquiry.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center w-full sm:w-auto rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:cursor-not-allowed disabled:bg-primary-300 transition-colors"
        >
          {isSubmitting ? 'Sending…' : 'Send Message'}
        </button>
      </div>
    </form>
  );
};

export default Form;
