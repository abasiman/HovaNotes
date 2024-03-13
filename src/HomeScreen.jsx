import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authdatabase, database, imageDb} from './firebase_todapp_config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';



function HomeScreen() {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [editMode, setEditMode] = useState(false); 


    const saveUserProfile = async (uid, profileData) => {
        const userDocRef = doc(database, "userProfiles", uid);
        await setDoc(userDocRef, profileData, { merge: true });
        setEditMode(false); 
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
    
        const profileData = {
            name: event.target.name.value,
            bio: event.target.bio.value,
            achievements: event.target.achievements.value,
            skills: event.target.skills.value,
        };
    
        const user = authdatabase.currentUser;
        if (user) {
            const file = event.target.profilePicture.files[0];
            if (file) {
                const imageRef = storageRef(imageDb, `profilePictures/${user.uid}`);
                await uploadBytes(imageRef, file).then(async (snapshot) => {
                    const downloadURL = await getDownloadURL(snapshot.ref);
                    profileData.profilePicture = downloadURL; 
                });
            }
    
            saveUserProfile(user.uid, profileData).then(() => {
                console.log("Profile updated successfully");
                setUserProfile(profileData);
            }).catch((error) => {
                console.error("Error updating profile: ", error);
            });
        }
    };
    

    // Handle sign out
    const handleSignOut = () => {
        signOut(authdatabase).then(() => navigate('/'))
            .catch((error) => console.error("Sign out error", error));
    };

    useEffect(() => {
        
        const unsubscribe = onAuthStateChanged(authdatabase, async (user) => {
            if (user) {
                const uid = user.uid;
                const userDocRef = doc(database, "userProfiles", uid);
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    setUserProfile(docSnap.data()); 
                } else {
                    console.log("No such document!");
                }
            } else {
                navigate('/');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    return (
        <>
        <div className='all'>

            <header>
           <div className="head">

           
            <div className="imgContainer">

          
            <h4>Hova Notes</h4>


            </div>
            </div>
            </header>

           <div className='Container'>
            
            <div className="link-to-todo">
            <Link to="/todo" >Go to Todo App</Link>
        </div>
           

            <div className='profile_bio'>
                <h2>User Profile</h2>
                <div className='profile_pic-bio'>
                <div className="profile_pic">
                {userProfile?.profilePicture && (
                  
                        
                  <img src={userProfile?.profilePicture || "picon.jpg"} alt="Profile"/>


                  
                )}
             
                  </div>
                  
                  < div className='prof_bio'>
                    <h3>{userProfile?.name}</h3>
                    <h4>{userProfile?.bio}</h4>
                    </div>

                    </div>
                
              
                 


                <h2>Achievements</h2>
                <div  className="achievements-content">
                <p>{userProfile?.achievements}</p>

                </div>

                <h2>Skills</h2>
                <div className='skills-content'>
                <p>{userProfile?.skills}</p>
               
                </div>
                <div className='home-btn'>
                <button className="profile-btns" onClick={() => setEditMode(!editMode)}>Edit Profile</button>
                </div>
                <div className='home-btn'>
                <button className="profile-btns"  onClick={handleSignOut}>Sign Out</button>
                
           
            </div>

            {/* Conditional rendering based on editMode state */}
            {editMode && (
                <div className='edit-section'>
                <form onSubmit={handleFormSubmit}>
                    <div>
                        <label htmlFor="profilePicture">Profile Picture:</label>
                        <input id="profilePicture" name="profilePicture" type="file" />
                    </div>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input id="name" name="name" type="text" defaultValue={userProfile?.name} />
                    </div>
                    <div>
                        <label htmlFor="bio">Bio:</label>
                        <input id="bio" name="bio" type="text" defaultValue={userProfile?.bio} />

                    </div>
                    <div>
                        <label htmlFor="achievements">Achievements:</label>
                        <textarea id="achievements" name="achievements" defaultValue={userProfile?.achievements} />
                    </div>
                    <div>
                        <label htmlFor="skills">Skills:</label>
                        <textarea id="skills" name="skills" type="text" defaultValue={userProfile?.skills} />
                    </div >
                    <div className='home-btn'>
                    <button className="profile-btns" type="submit">Update Profile</button>
                    </div>
                    
                   
                </form>
                </div>
                
            )}
             
         </div>
            
            </div>
            </div>
        </>
    );
}

export default HomeScreen;
