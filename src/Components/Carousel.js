import { useEffect, useState } from "react";

function Carousel(props){

    const [data, setData] = useState({
        title: '',
        indexValue: '',
        albumId: '',
        url: '',
        maxLength: '',
        albumIndex: ''
    })


    // get data for carousel
    useEffect(()=>{
        async function findImage(){
            props.fireStoreData.map((value, i)=>{
                
                if(value.id === props.carouselData.albumId ){
                    value.image.map((value, index)=>{
                        if(value.title === props.carouselData.title && props.carouselData.url === value.url){
                            const maxLength = props.fireStoreData[i].image.length - 1;
                            setData({
                                title: props.carouselData.title,
                                indexValue: index,
                                albumId: props.carouselData.albumId,
                                url: props.carouselData.url,
                                maxLength,
                                albumIndex: i
                            })
                        }
                       
                    })
                }
            })
        }

        findImage()
    }, [])

    
    // navigate image
    function navigate(value){
        let indexValue = data.indexValue + value 
        const maxLength = data.maxLength
        const i = data.albumIndex
        if(maxLength <= indexValue){
            indexValue = 0 
        }
        if(indexValue < 0){
            indexValue = maxLength - 1 
        }
        const obj = props.fireStoreData[i].image[indexValue]
        
        const newSetData = {
            title: obj.title,
            indexValue,
            albumId: data.albumId,
            url: obj.url,
            maxLength,
            albumIndex: i
        }
        setData(newSetData)
    }

    
    return (
        <>
            <div className="carousel-background flex vcenter hcenter">
                <div className="image">
                        <img src={data.url} alt={data.title}></img>
                        <span className="prev flex hcenter vcenter" onClick={()=> navigate(-1)} ><i className="fa-solid fa-chevron-left"></i></span>
                        <span className="next flex hcenter vcenter" onClick={()=> navigate(1)} ><i className="fa-solid fa-chevron-right"></i></span>
                        <span className="carousel-title">{data.title}</span>
                </div>
                <div className="carousel-back" onClick={()=> props.carouselStateToggle(false)}>
                    <i className="fa-solid fa-circle-xmark"></i>
                </div>
            </div>
        </>
    )
}

export default Carousel;    