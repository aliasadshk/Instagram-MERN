import React, { useState, useContext } from 'react';
import { 
  FaHome, 
  FaSearch, 
  FaPlusSquare, 
  FaRegPaperPlane, 
  // FaHeart, 
  FaUserAlt,
  FaSignOutAlt 
} from 'react-icons/fa';
import { ImCross } from 'react-icons/im';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userContext } from "../App";

const InstagramNavbar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [search, setSearch] = useState('');
  const [userDetails, setUserDetails] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const { state, dispatch } = useContext(userContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: "CLEAR" });
    navigate("/signin");
    toast.success("Logout Successfully");
  };

  const searchUser = (query) => {
    setSearch(query);
    fetch("http://localhost:2048/searchuser", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUserDetails(data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const SearchDialog = () => {
    return (
      <div 
        className={`${showSearch ? "fixed" : "hidden"} inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center`}
      >
        <div className="bg-white w-[90%] max-w-[550px] rounded-lg p-6 relative">
          <ImCross 
            className="absolute top-4 right-4 text-gray-700 text-2xl cursor-pointer" 
            onClick={() => setShowSearch(false)}
          />
          <input 
            className="w-full border-2 border-black py-2 px-4 outline-none mb-4 focus:border-blue-500 rounded-md" 
            type="text" 
            placeholder="Search User..." 
            value={search}
            onChange={(e) => searchUser(e.target.value)}
          />
          <ul className="max-h-[300px] overflow-y-auto">
            {userDetails.length !== 0 ? (
              userDetails.map((item) => (
                <Link 
                  key={item._id}
                  to={state._id == item._id ? "/profile" : `/profile/${item._id}`}
                  onClick={() => setShowSearch(false)}
                >
                  <li className="p-2 hover:bg-gray-100 rounded">
                    {item.email}
                  </li>
                </Link>
              ))
            ) : (
              <h3 className="text-gray-500 text-xl font-medium text-center py-4">
                Not found :)
              </h3>
            )}
          </ul>
        </div>
      </div>
    );
  };

  const navItems = [
    { icon: FaHome, label: 'Home', route: '/', key: 'home' },
    { 
      icon: FaSearch, 
      label: 'Search', 
      action: () => setShowSearch(true), 
      key: 'search' 
    },
    { icon: FaPlusSquare, label: 'Create', route: '/Createpost', key: 'create' },
    { icon: FaRegPaperPlane, label: 'Messages', route: '/Message', key: 'message' },
    // { icon: FaHeart, label: 'Notifications', route: '/notifications', key: 'notifications' },
    { icon: FaUserAlt, label: 'Profile', route: '/profile', key: 'profile' }
  ];

  return (
    <>
      {/* Search Dialog */}
      {SearchDialog()}

      {/* Top Navbar for Mobile */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white border-b z-40 flex justify-between items-center px-4 py-2">
        <h2 className="text-4xl font-medium">Instagram</h2>


        
        <div className="flex items-center space-x-4">
          <FaPlusSquare onClick={() => navigate('/create')} />
          <FaRegPaperPlane onClick={() => navigate('/messages')} />
        </div>
      </div>

      {/* Bottom Navbar for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t z-40 flex justify-around py-2">
        {navItems.map((item) => (
          item.action ? (
            <div 
              key={item.key}
              className={`flex flex-col items-center ${activeTab === item.key ? 'text-blue-500' : 'text-gray-700'}`}
              onClick={() => {
                setActiveTab(item.key);
                item.action();
              }}
            >
              <item.icon size={24} />
            </div>
          ) : (
            <Link 
              key={item.key}
              to={item.route}
              className={`flex flex-col items-center ${activeTab === item.key ? 'text-blue-500' : 'text-gray-700'}`}
              onClick={() => setActiveTab(item.key)}
            >
              <item.icon size={24} />
            </Link>
          )
        ))}
      </nav>

      {/* Sidebar for Web */}
      <nav className="hidden md:block fixed left-0 top-0 h-full w-[250px] bg-white border-r p-4">

        <Link to="/" className="text-2xl font-bold block mb-10">Instagram</Link>


        
        <div className="space-y-4">
          {navItems.map((item) => (
            item.action ? (
              <div 
                key={item.key}
                className={`
                  flex items-center space-x-4 p-3 rounded-md cursor-pointer
                  ${activeTab === item.key ? 'bg-gray-100' : 'hover:bg-gray-50'}
                `}
                onClick={() => {
                  setActiveTab(item.key);
                  item.action();
                }}
              >
                <item.icon size={24} />
                <span className="text-lg">{item.label}</span>
              </div>
            ) : (
              <Link 
                key={item.key}
                to={item.route}
                className={`
                  flex items-center space-x-4 p-3 rounded-md 
                  ${activeTab === item.key ? 'bg-gray-100' : 'hover:bg-gray-50'}
                `}
                onClick={() => setActiveTab(item.key)}
              >
                <item.icon size={24} />
                <span className="text-lg">{item.label}</span>
              </Link>
            )
          ))}
        </div>

        {/* Logout Option */}
        <div className="absolute bottom-4 left-4 right-4">
          <button 
            className="flex items-center space-x-4 p-3 w-full hover:bg-red-50 rounded-md text-red-600"
            onClick={handleLogout}
          >
            <FaSignOutAlt size={24} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default InstagramNavbar;