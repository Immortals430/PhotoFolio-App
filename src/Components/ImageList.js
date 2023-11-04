import React, { useEffect, useState } from "react"
import { collection, getDoc, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db } from "../firestore"
import Carousel from "./Carousel"

function ImageList(props) {
    const titleRef = React.createRef()
    const urlRef = React.createRef()
    const updateTitleRef = React.createRef()
    const updateUrlRef = React.createRef()


    const [hide, setStyle] = useState(true)
    const [fireStoreData, setFireStoreData] = useState([])
    const [carouselData, setCarouselData] = useState({state: false, albumId: "", title: "", url: ""})
    const [updateForm, setUpdateForm] = useState({title: '', url: '', state: false})
    const [albumName, setAlbumName] = useState()
    

    //  toggle hide element
    function unHide() {
        setStyle(!hide)                         
    }


    /* toggle update form */
    function toggleUpdateForm(title, url){
        setUpdateForm({
            title, url, state: !updateForm.state
        })
    }


    /* carousel state toggle */
    function carouselStateToggle(state, albumId, title, url){
        setCarouselData({state, albumId, title, url})
    }


    // empty input element
    function emptyInput() {
        titleRef.current.value = ""  
        urlRef.current.value = ""          
    }


    // get fireStore Data
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


    // deleteImage
    async function deleteImage(id, title, url){
        const docSnap = await getDoc(doc(db, "Album", id));
        const existingImageArray = docSnap.data().image

        const updateData = existingImageArray.map((value)=>{
            if(value.url === url && title === value.title)  return null 
            else return value
        })
        .filter((value) => value !== null);

        const docRef = doc(db, "Album", id);
        await setDoc(docRef, {
            albumName: docSnap.data().albumName,
            image: updateData
        });        
    }


    /* edit */
    async function edit(id, newTitle, newUrl){
        const title = newTitle.current.value.trim()
        const url = newUrl.current.value.trim()
        if(title == '' && url == '') return
        const docSnap = await getDoc(doc(db, "Album", id));
        const existingImageArray = docSnap.data().image

        const updateData = existingImageArray.map((value)=>{
            if(value.url === updateForm.url && updateForm.title === value.title){
                return {title, url}              
            }   
            else return value
        })

        const docRef = doc(db, "Album", id);
        await setDoc(docRef, {
            albumName: docSnap.data().albumName,
            image: updateData
        }); 

        setUpdateForm({
            title: '', url: '', state: !updateForm.state
        })
    }


    return (
        <>
            <main>
                <section  >
                    <div className="flex header imageList-header">
                        <div className="flex">
                            <i className="fa-solid fa-arrow-left" onClick={props.renderImageList}></i>
                            <div>Images of {props.imageList.albumName}</div>
                        </div>
                        <div className="flex hcenter vcenter">
                            <button onClick={unHide}> {hide ? "Add Image" : "Cancel"}</button>
                        </div>
                    </div>

                    {!hide ? 
                        <div className="flex hcenter form">
                            <h4>Add Image of {props.imageList.albumName}{/* {props.album[props.imageList].albumName} */} </h4>

                            <div className="flex vcenter imageLsit-input-container">
                                <input type="text" placeholder="title" ref={titleRef} required/>
                                <input type="url" placeholder="url" ref={urlRef} required />
                                <i className="fa-solid fa-circle-xmark" onClick={emptyInput} ></i>
                                <button onClick={()=>{props.addImage(titleRef, urlRef); emptyInput(); }} >Add</button>
                            </div>
                        </div>
                     : null}

                {updateForm.state ? 
                    <div className="flex hcenter upDateForm">
                        <input ref={updateTitleRef} placeholder="Title" required />
                        <input ref={updateUrlRef} placeholder="Url" required/>
                        <button onClick={()=> {edit(props.imageList.id, updateTitleRef, updateUrlRef); }}>Update</button>
                    </div> 
                : null }

                </section>
               


                <section className="flex hcenter" >     
                    {fireStoreData.map((fireStoreData, i)=>{
                        if(props.imageList.id === fireStoreData.id){
                            return fireStoreData.image.map((value, i)=>{
                                return value.title && value.url ? (
                                        <div className="card-wrapper" key={i}>
                                                <div key={i} className="card flex" style={{background: `url(${value.url}) center`, backgroundSize: "cover"}}>
                                                <div className="card-opaque" onClick={()=> carouselStateToggle(true, fireStoreData.id, value.title, value.url)}></div>
                                                <a className="download" href={value.url} download><i className="fa-solid fa-download"></i></a>
                                                <span className="edit" onClick={()=> toggleUpdateForm(value.title, value.url)}><i className="fa-solid fa-file-pen"></i></span>
                                                <span className="delete" onClick={()=>{deleteImage(props.imageList.id, value.title, value.url)}}><i className="fa-solid fa-circle-xmark"></i></span>
                                                <div className="title">{value.title}</div>
                                            </div>
                                        </div> ) : null 
                                }
                            )
                        }
                    })} 
                </section>
            </main>

            {carouselData.state ? (
                <Carousel fireStoreData={fireStoreData}
                          carouselStateToggle={carouselStateToggle}
                          carouselData={carouselData} /> ): null
            }
        </>
    )
}

export default ImageList 