import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from '../button';
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import { toast } from 'sonner';

const options = [
  'Sales', 'Finance', 'Marketing', 'IT', 'Management', 'UI Designing', 'Business Development'
];

const CreateUserPopup = ({ setCreateUserModal, mode, selectedUserData }) => {
  const popupRef = useRef(null);
  const [loading, seteLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    domain: '',
    available: '',
    avatar: null,
    gender: 'option-one',
  });

  useEffect(() => {
    if (mode === 'update' && selectedUserData) {
      setFormData({
        first_name: selectedUserData.first_name,
        last_name: selectedUserData.last_name,
        email: selectedUserData.email,
        domain: selectedUserData.domain,
        available: selectedUserData.available ? 'true' : 'false',
        avatar: selectedUserData.avatar,
        gender: selectedUserData.gender === 'Male' ? 'option-one' : 'option-two',
      });
    }
  }, [mode, selectedUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'available' ? (value === 'true') : value,
    }));
  };
  
  const handleRadioChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      gender: value,
    }));
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setCreateUserModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCreateUser = async () => {
    try {
      seteLoading(true)
      const formDetails = new FormData();
      for (let key in formData) {
        formDetails.append(key, formData[key]);
      }

      const response = await axios.post('http://localhost:3000/api/user/createUser', formDetails);
      if(response){
        toast.success("User created successfully");
        setCreateUserModal(false);
      }
    } catch (error) {
      console.log(error);
    }finally{
      seteLoading(false)
    }
  };

  return (
    <div className='w-full h-auto'>
      <div ref={popupRef} className='inset-0 fixed w-[30%] my-auto h-[36rem] p-10 rounded-md border border-black mx-auto flex flex-col items-center bg-slate-100 z-20'>
        <div className='flex justify-between items-center w-[70%] mb-5'>
          <h1 className='text-center font-bold text-xl'>
            {mode === 'create' ? 'Create User' : 'Update User'}
          </h1>
          <IoClose size={20} onClick={() => setCreateUserModal(false)} />
        </div>

        <Input type="text" placeholder="Enter first name" className="mb-5 mt-2" name="first_name" value={formData.first_name} onChange={handleChange} />
        <Input type="text" placeholder="Enter last name" className="mb-5 mt-2" name="last_name" value={formData.last_name} onChange={handleChange} />
        <Input type="email" placeholder="Enter email" className="mb-5 mt-2" name="email" value={formData.email} onChange={handleChange} />

        <div className='flex flex-col gap-5 w-full'>
          <select className='p-2' name="domain" value={formData.domain} onChange={handleChange}>
            <option value="">Select domain</option>
            {options.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </select>

          <select className='p-2' name="available" value={formData.available} onChange={handleChange}>
            <option value="">Select availability</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>

          <Label className="text-start">Select Profile Picture</Label>
          <Input type="file" name="avatar" onChange={(e) => setFormData((prevData) => ({
            ...prevData,
            avatar: e.target.files[0],
          }))} />
        </div>

        <RadioGroup className="flex mt-3 mb-3 gap-4" defaultValue={formData.gender} onValueChange={handleRadioChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-one" id="option-one" />
            <Label htmlFor="option-one">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-two" id="option-two" />
            <Label htmlFor="option-two">Female</Label>
          </div>
        </RadioGroup>

        <Button className="mt-2 mb-2" onClick={handleCreateUser}>
          {mode === 'create' ? 
          loading ? ('Loading...') : 'Create User' :
           'Update User'}
        </Button>
      </div>
    </div>
  );
};

export default CreateUserPopup;
