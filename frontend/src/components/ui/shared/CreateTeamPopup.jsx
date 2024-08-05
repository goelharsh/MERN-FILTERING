import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '../button';
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import { toast } from 'sonner'; // Assuming you're using `sonner` for toasts
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const CreateTeamPopup = ({ setCreateTeamModal }) => {
  const popupRef = useRef(null);
  const [teamName, setTeamName] = useState("");
  const [teamTagline, setTeamTagline] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUserArray, setSelectedUserArray] = useState([]);

  const handleTeamName = (e) => {
    setTeamName(e.target.value);
  };

  const handleTeamTagline = (e) => {
    setTeamTagline(e.target.value);
  };

  const handleCreateTeam = async () => {
    try {
     
      const response = await axios.post(`${API_BASE_URL}/team/createTeam`, {
        team_name: teamName,
        team_tagline: teamTagline,
        users: selectedUserArray.map(user => user._id)
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(response){
        toast.success("Team created successfully!");
        setCreateTeamModal(false)
      }
    
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }finally{
    
    }
  };

  const handleSearchParam = (e) => {
    setSearchParam(e.target.value);
  };

  const handleTeamMemberSearch = async (page = 1) => {
    try {
    
      const response = await axios.get(`${API_BASE_URL}/user/getHomeData`, {
        headers: {
          "Content-Type": 'application/json',
        },
        params: {
          page: page,
          limit: 6,
          search: searchParam || "",
        },
      });
      if (response) {
        setSearchedUsers(response.data.data);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleTeamMemberSearch(currentPage);
  }, [currentPage]);

  const handleSelectedUser = (user) => {
    setSelectedUserArray((prevArray) => [...prevArray, user]);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setCreateTeamModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='w-full h-auto'>
      <div ref={popupRef} className='inset-0 fixed w-[60%] my-auto h-auto mt-2 mb-4 p-10 rounded-md border border-black mx-auto flex gap-5 items-center bg-slate-100 z-20'>
        <div className='w[50%] mx-auto'>
          <div className='flex justify-between items-center w-[100%] mb-5'>
            <h1 className='text-center font-bold text-xl'>Create Team</h1>
            <IoClose size={20} onClick={() => setCreateTeamModal(false)} />
          </div>

          <Input
            type="text"
            placeholder="Enter team name"
            className="mb-5 mt-2"
            value={teamName}
            onChange={handleTeamName}
            name="teamName"
          />
          <Input
            type="text"
            placeholder="Enter team tag line"
            className="mb-5 mt-2"
            value={teamTagline}
            onChange={handleTeamTagline}
            name="teamTagline"
          />

          <h2 className='flex justify-start w-full text-lg'>Search User for selection</h2>
          <div className='flex gap-4 w-full'>
            <Input
              type="text"
              className="outline-none border border-black p-5"
              value={searchParam}
              onChange={handleSearchParam}
              name="searchParam"
              placeholder="Enter name to search"
            />
            <Button onClick={() => handleTeamMemberSearch()}>Search</Button>
          </div>
          <div className='w-[60%] mx-auto mt-2'>
            {selectedUserArray.map((user, index) => (
              <p key={index}>{user.first_name} {user.last_name}</p>
            ))}
          </div>
          <Button onClick={handleCreateTeam} className="mt-4 mb-2 mx-auto w-full">Create Team</Button>
        </div>

        <div className='w-[50%] mx-auto'>
          <div className='w-full flex flex-wrap'>
            {
              searchedUsers ? (searchedUsers.map((member, index) => (
                <div onClick={() => handleSelectedUser(member)} key={index} className='flex w-[30%] mr-2 flex-wrap gap-3 bg-slate-200 p-4 rounded-md mb-2 mt-1'>
                  <h2>{member.first_name} {member.last_name}</h2>
                  <img src={member.avatar} width={20} />
                </div>
              ))) : (<div>No user found</div>)
            }
          </div>
          <div className='w-full mx-auto gap-5 flex items-center justify-center mt-4'>
            <Button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</Button>
            <span className='font-bold items-center'>{currentPage} of {totalPages}</span>
            <Button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</Button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CreateTeamPopup;
