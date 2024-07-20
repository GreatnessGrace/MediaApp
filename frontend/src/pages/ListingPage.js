import React, { useState, useEffect } from "react";
import axios from "axios";

function ListingPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("/api/users/all-users");
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Listing Page</h1>
      {users.map((user, index) => (
        <div key={index}>
          <h2>{user.firstName}</h2>
          {user.videos.slice(0, 5).map((video, i) => (
            <div key={i}>
              <h3>{video.title}</h3>
              <p>{video.description}</p>
            </div>
          ))}
          <button onClick={() => alert("Display all videos logic here")}>
            Display All Videos
          </button>
        </div>
      ))}
    </div>
  );
}

export default ListingPage;
