import {useState} from "react"
import NavBar from "./Components/NavBar.js"
import AlbumList from "./Components/AlbumList.js"
import ImageList from "./Components/ImageList.js"
import { collection, addDoc, getDoc, doc, setDoc } from "firebase/firestore"; 
import { db } from "./firestore.js"

function App() {

  const [imageList, setImageList] = useState({id: "", renderState: false, albumName: ""})



  // addImage
  async function addImage(titleRef, urlRef) {
    const title = titleRef.current.value.trim()
    const url = urlRef.current.value.trim()
    if(title == '' && url == '') return
    const docSnap = await getDoc(doc(db, "Album", imageList.id));
    const existingImageArray = docSnap.data().image

    const docRef = doc(db, "Album", imageList.id);
        await setDoc(docRef, {
          albumName: docSnap.data().albumName,
          image: [{title, url}, ...existingImageArray]
        });

  }


  // toggle renderImageList
  function renderImageList(id, albumName){
    setImageList({ renderState: !imageList.renderState, id, albumName })
  }


  // createAlbum
  async function createAlbum(createAlbumInputRef) {
    const albumName = createAlbumInputRef.current.value.trim()
    if(albumName == '') return

    await addDoc(collection(db, "Album"), {
      albumName, image: [ {title: null, url: null} ]
    }); 
}




  

  return(
    <>
      <NavBar />
      {imageList.renderState ? <ImageList
                                          imageList={imageList}
                                          renderImageList={renderImageList}
                                          addImage={addImage} /> :  

                               <AlbumList renderImageList={renderImageList}
                                          createAlbum={createAlbum}
                   
                                           />
      }

    </>
  )
}

export default App