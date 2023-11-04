import React, { useEffect, useState } from "react"
import { collection, onSnapshot, doc, deleteDoc, Firestore } from "firebase/firestore";
import { db } from "../firestore"


function AlbumList(props){

    const createAlbumInputRef = React.createRef()
    const [hide, setStyle] = useState(true)
    const [fireStoreData, setFireStoreData] = useState([])

    
    //  toggle hide element
    function unHide() {
        setStyle(!hide)                         
    }


    // empty input element
    function emptyInput() {
        createAlbumInputRef.current.value = ""                 
    }


    // store firestore data to fireStoreData state
    useEffect(()=>{
        async function fetchFireStoreData(){
            onSnapshot(collection(db, "Album"), (querySnapshot) => {
                const data = querySnapshot.docs.map((doc) => {
                    const data = doc.data()
                    const id = doc.id
            
                    return { image: data.image, id, albumName: data.albumName }
                });
                setFireStoreData(data)
            })
        }
        fetchFireStoreData()
    }, [])


    // delete album
    async function deleteAlbum(id){
        await deleteDoc(doc(db, "Album", id));
    }


    return (
        <>  <main>
                <section>
                    <div className="flex header">
                        <p>PHOTOGRAPHER & ART DIRECTOR, IND</p>
                        <button onClick={unHide}> {hide ? "Add album" : "Cancel"}</button>
                    </div>

                    {!hide ? 
                    <div className="flex hcenter form">
                        <h4>Create an Album</h4>
                        <div className="flex ">     
                            <div className="input">
                                <input type="text" ref={createAlbumInputRef} required/>
                                <span  onClick={emptyInput} className="flex vcenter "><i className="fa-solid fa-circle-xmark"></i></span>
                            </div>                   
                            <button onClick={()=>{props.createAlbum(createAlbumInputRef); emptyInput(); }}>Create</button>
                        </div> 
                    </div>
                    : null} 

                </section>

                <section className="flex hcenter">
                        {fireStoreData.map((value, i)=>{
                            return <div className="card-wrapper" key={i}>                        
                                        <div  className="card flex" style={value.image[0].url ? { background: `url(${value.image[0].url}) center`, backgroundSize: "cover" } : null}>
                                            <div className="card-opaque" onClick={()=> props.renderImageList(value.id, value.albumName)}></div>
                                            <span className="delete" onClick={()=>deleteAlbum(value.id)}><i className="fa-solid fa-circle-xmark"></i></span>
                                            <div><i className="fa-solid fa-image"></i></div>
                                            <div className="title" onClick={()=> props.renderImageList(value.id, value.albumName)}>{value.albumName}</div>
                                        </div> 
                                    </div>
                                      
                        })}
          
                </section>
            </main>
        </>
    )
}

export default AlbumList

