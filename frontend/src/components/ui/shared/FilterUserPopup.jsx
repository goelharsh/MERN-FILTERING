import React, { useEffect, useRef, useState } from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from '../button';
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import { toast } from 'sonner';

const FilterUserPopup = ({ setFilterModal, setAllUsers }) => {
  const popupRef = useRef(null);
  const [domain, setDomain] = useState("");
  
  const [available, setAvailable] = useState("option-one");
  const [gender, setGender] = useState("option-one");
  const [loading, setLoading] = useState(false);

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setFilterModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFilterUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/api/user/filteredUsers', {
        domain,
        available: available === "option-one",
        gender: gender === "option-one" ? "Male" : "Female"
      });

      if (response.data.success) {
        setAllUsers(response.data.data);
        toast.success(response.data.message);
        setFilterModal(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-auto'>
      <div ref={popupRef} className='inset-0 fixed w-[30%] my-auto h-[30rem] p-10 rounded-md border border-black mx-auto flex flex-col items-center bg-slate-100 z-20'>
        <div className='flex justify-between items-center w-[70%] mb-5'>
          <h1 className='text-center font-bold text-xl'>Choose Filter Option</h1>
          <IoClose size={20} onClick={() => setFilterModal(false)} />
        </div>

        <div className='flex flex-col gap-5 w-full'>
          {/* Domain */}
          <Label className="font-bold">DEPARTMENT</Label>
          <select className='p-2' value={domain} onChange={(e) => setDomain(e.target.value)}>
            <option value="">Select Domain</option>
            <option value="IT">IT</option>
            <option value="Management">Management</option>
            <option value="Finance">Finance</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="UI Designing">UI Designing</option>
            <option value="Business Development">Business Development</option>
          </select>

          {/* Availability */}
          <Label className="font-bold">AVAILABILITY</Label>
          <RadioGroup defaultValue="option-one" className="flex gap-4" onValueChange={setAvailable}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-one" id="available-true" />
              <Label htmlFor="available-true">True</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-two" id="available-false" />
              <Label htmlFor="available-false">False</Label>
            </div>
          </RadioGroup>

          {/* Gender */}
          <Label className="font-bold">GENDER</Label>
          <RadioGroup defaultValue="option-one" className="flex gap-4" onValueChange={setGender}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-one" id="gender-male" />
              <Label htmlFor="gender-male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-two" id="gender-female" />
              <Label htmlFor="gender-female">Female</Label>
            </div>
          </RadioGroup>

          <Button onClick={handleFilterUsers} className="mt-4 mb-2 w-full" disabled={loading}>
            {loading ? 'Loading...' : 'Submit'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterUserPopup;
