
'use client';

import { useState } from 'react';
import Select from 'react-select';
import { motion } from 'framer-motion';

type ApiResponse = {
  is_success: boolean;
  user_id: string;
  email: string;
  roll_number: string;
  numbers: string[];
  alphabets: string[];
  highest_lowercase_alphabet: string[];
};

const Home = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(jsonInput);

      const res = await fetch('/api/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedInput),
      });

      if (res.ok) {
        const data: ApiResponse = await res.json();
        setResponse(data);
        setError('');
      } else {
        setError('Failed to fetch data. Please try again.');
      }
    } catch (err) {
      setError('Invalid JSON input. Please provide a valid JSON.');
    }
  };

  const handleFilterChange = (selectedOptions: any) => {
    const selectedValues = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
    setSelectedFilters(selectedValues);
  };

  const filterResponse = () => {
    if (!response) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ ease: 'easeOut', duration: 0.3 }}
        className="text-gray-300"
      >
        <h3 className="text-lg font-semibold mb-2">Filtered Response</h3>
        {selectedFilters.includes('Numbers') && (
          <p>Numbers: {response.numbers.join(', ')}</p>
        )}
        {selectedFilters.includes('Alphabets') && (
          <p>Alphabets: {response.alphabets.join(', ')}</p>
        )}
        {selectedFilters.includes('Highest Lowercase Alphabet') && (
          <p>Highest Lowercase Alphabet: {response.highest_lowercase_alphabet.join(', ')}</p>
        )}
      </motion.div>
    );
  };

  const filterOptions = [
    { value: 'Numbers', label: 'Numbers' },
    { value: 'Alphabets', label: 'Alphabets' },
    { value: 'Highest Lowercase Alphabet', label: 'Highest Lowercase Alphabet' },
  ];

  const customStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: '#000000',
      borderColor: '#374151',
      color: '#e5e7eb',
      '&:hover': {
        borderColor: '#3b82f6',
      },
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: '#000000',
      borderColor: '#374151',
    }),
    menuList: (base: any) => ({
      ...base,
      backgroundColor: '#000000',
    }),
    option: (base: any, state: any) => ({
      ...base,
      color: '#e5e7eb',
      backgroundColor: state.isFocused ? '#6b7280' : '#000000',
      '&:hover': {
        backgroundColor: '#6b7280',
      },
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: '#3b82f6',
      color: '#ffffff',
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: '#ffffff',
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: '#ffffff',
      '&:hover': {
        backgroundColor: '#1f2937',
        color: '#ffffff',
      },
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#9ca3af',
    }),
    singleValue: (base: any) => ({
      ...base,
      color: '#e5e7eb',
    }),
  };

  return (
    <div className="min-h-screen bg-black p-8 text-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ ease: 'easeOut', duration: 0.3 }}
        className="mb-6"
      >
        <h2 className="text-xl font-semibold mb-2">API Input</h2>
        <textarea
          value={jsonInput}
          onChange={handleInputChange}
          rows={4}
          className="w-full p-4 rounded-md border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:border-blue-500"
          placeholder="Enter JSON input here"
        />
        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </motion.div>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
          className="text-red-400 mb-4"
        >
          {error}
        </motion.p>
      )}
      {response && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
        >
          <Select
            options={filterOptions}
            isMulti
            onChange={handleFilterChange}
            placeholder="Multi Filter"
            styles={customStyles}
            classNamePrefix="react-select"
          />
          {filterResponse()}
        </motion.div>
      )}
    </div>
  );
};

export default Home;

