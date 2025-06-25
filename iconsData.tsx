import {faFlask , faBook , faGlobe ,faLaptopCode , faPalette , faComments , faPhoneAlt} from "@fortawesome/free-solid-svg-icons"

interface iconData{
    faIcon:any;
    isSelected:boolean
}

export const icondata:iconData[]=[
    {
        faIcon:faFlask,
        isSelected:true,
    },
    {
        faIcon:faBook,
        isSelected:false,
    },
    {
        faIcon:faGlobe,
        isSelected:false,
    },
    {
        faIcon:faLaptopCode,
        isSelected:false,
    },
    {
        faIcon:faPalette,
        isSelected:false,
    },
    {
        faIcon:faComments,
        isSelected:false,
    },
    {
        faIcon:faPhoneAlt,
        isSelected:false,
    },
]