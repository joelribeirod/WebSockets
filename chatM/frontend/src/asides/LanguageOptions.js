import { useEffect, useRef, useState } from 'react'
import br from '../imgs/br.svg'
import us from '../imgs/us.svg'
import './LanguageOptions.css'

function LanguageOptions({getLang}){
    const divRef = useRef(null)
    const [isSelected, setIsSelected] = useState(false)
    const [countrySelected, setCountrySelected] = useState(null)
    const [img, setImg] = useState(null)
    const [whatLanguage, setWhatLanguage] = useState(null)

    // Change the value of 'language' on localStorage
    useEffect(()=>{
        if(!countrySelected){
            return;
        }

        localStorage.setItem('language', JSON.stringify({language: countrySelected}))
        setWhatLanguage(countrySelected)
        getLang(countrySelected)
    },[countrySelected])

    useEffect(()=>{
        
    },[])
    

    const language = localStorage.getItem('language')
    if(!language){
        localStorage.setItem('language', JSON.stringify({language: 'br'}))
    }
    

    const imgs = [{
        country: 'us',
        src: us,
        width: "24",
        height: "24",
        alt: "United States Of America"
    },{
        country: 'br',
        src: br,
        width: "24",
        height: "24",
        alt: "Brazil"
    }]

    useEffect(()=>{
        const languageValue = JSON.parse(language)
        let findImg

        if(!language){
            findImg = imgs.find(img => img.country === 'br')
        }else{
            findImg = imgs.find(img => img.country === languageValue.language)
        }
        
        setImg(findImg)
    },[language])
    

    function languageSelector(e) {
        if(divRef.current.className === 'selectionOff'){
            divRef.current.className = 'selectionOn'
            setIsSelected(true)
        }else{
            divRef.current.className = 'selectionOff'
            setIsSelected(false)
        }
    }

    return (
        <div id='selectLanguage' 
            className='selectionOff' 
            ref={divRef} 
            onClick={languageSelector}
        >
            {isSelected ? imgs.map((img)=>(
                <span id={img.country} onClick={(e)=>{
                    setCountrySelected(img.country)
                }}>
                    <img src={img.src} alt={img.alt} width={img.width} height={img.height}/>
                    <p>{img.country}</p>
                </span>
                
            )) : img && <img src={img.src} alt={img.alt} width={img.width} height={img.height}/>}
           
        </div>
    )
}

export default LanguageOptions