import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CreateTeamPopup from '@/components/ui/shared/CreateTeamPopup';
import CreateUserPopup from '@/components/ui/shared/CreateUserPopup';
import FilterUserPopup from '@/components/ui/shared/FilterUserPopup';
import HomeCard from '@/components/ui/shared/HomeCard';
import TeamCard from '@/components/ui/shared/TeamCard';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const Home = () => {
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [createUserModal, setCreateUserModal] = useState(false);
  const [mode, setMode] = useState("create");
  const [createTeamModal, setCreateTeamModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [teamList, setTeamList] = useState([])
  
  const fetchUsers = async (page = 1, searchParam = "") => {
    try {
      const response = await axios.get(`http://localhost:3000/api/user/getHomeData`, {
        headers: {
          "Content-Type": 'application/json',
        },
        params: {
          page: page,
          limit: 20,
          search: searchParam,
        },
      });
      if (response) {
        setAllUsers(response.data.data);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetchUserById = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/user/${userId}`);
      if (response) {
        setSelectedUserData(response.data.data);
        setCreateUserModal(true);
        setMode("update");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleSearch = () => {
    fetchUsers(1, search);
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const inputChangeHandler = (e) => {
    setSearch(e.target.value);
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

  const isModalOpen = createUserModal || createTeamModal || filterModal;

  const fetchTeamList = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/api/team/getAllTeams`, {
        headers: {
          "Content-Type": 'application/json',
        }
      });
      if (response) {
        setTeamList(response.data.data);
        console.log(response.data.data)
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTeamList()
  }, []);

  return (
    <div className='w-full h-auto'>
      {isModalOpen && <div className='fixed inset-0 bg-black opacity-50 z-10'></div>}

      {createUserModal && (
        <CreateUserPopup
          setCreateUserModal={setCreateUserModal}
          mode={mode}
          selectedUserData={selectedUserData}
        />
      )}
      {createTeamModal && (<CreateTeamPopup setCreateTeamModal={setCreateTeamModal}/>)}
      {filterModal && (<FilterUserPopup setFilterModal={setFilterModal} setAllUsers={setAllUsers}/>)}

      <div className='w-[80%] h-[6rem] flex items-center justify-between mx-auto z-20'>
        <h1 className='font-bold text-3xl'>Heliverse</h1>
        <div className='flex justify-center items-center gap-10'>
          <Button onClick={() => setCreateTeamModal(true)}>Create Team</Button>
          <Button onClick={() => {
            setCreateUserModal(true);
            setMode("create");
          }}>Create User</Button>
        </div>
      </div>

      {/* USER DETAILS  */}
      <div className='w-[70%] flex mx-auto flex-col items-center z-20'>
        <h2 className='text-3xl font-bold mb-10 mt-20'>User Details</h2>
        <div className='flex gap-4 w-[50%]'>
          <Input type="text" value={search} onChange={inputChangeHandler} className="outline-none border border-black p-5" placeholder="Enter name" />
          <Button onClick={handleSearch}>Search</Button>
        </div>

        <div className='mx-auto w-[100%]'>
          <div className=' flex justify-center items-center gap-4'>
            <h2 className='text-2xl mt-16 font-bold mb-4 text-center'>List of all users</h2>
            <Button className="mt-16 mb-4" onClick={() => setFilterModal(true)}>Filter Users</Button>
          </div>

          {/* PAGINATION */}
          <div className='flex flex-wrap gap-6'>
            <div className=' flex flex-wrap gap-6'>
              {allUsers.map((user, index) => (
                <HomeCard
                  className="min-w-32"
                  key={index}
                  user={user} 
                  setCreateUserModal={setCreateUserModal}
                  setMode={setMode}
                  fetchUserById={fetchUserById}
                />
              ))}
            </div>
            <div className='mx-auto mb-4 gap-5 flex items-center'>
              <Button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</Button>
              <span className='font-bold items-center'>{currentPage} of {totalPages}</span>
              <Button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</Button>
            </div>
          </div>

          <div className='flex flex-col gap-6 mb-10 py-4'>
            <h2 className='text-center w-full text-2xl mt-10 font-bold'>Team Details</h2>
            <div className=' flex flex-wrap gap-12'>
              {teamList.map((team, index) => (
                <div className='mb-5'>
                  <TeamCard
                  className="flex flex-wrap"
                  team={team}
                  key={index}
                />
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Home;
