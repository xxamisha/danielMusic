import {useState, useRef, useEffect} from 'react';

export default function progressBar({progress,isPlaying} : {progress: number, isPlaying: boolean}) {
    const intervalRef = useRef<number| null>(null);
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
    if(isPlaying){
        intervalRef.current = setInterval(() => {
            setElapsed((e) => e+1);
        },1000);
                
    }else{
        if(intervalRef.current) 
        clearInterval(intervalRef.current!);
    
    }
    return() => {
        if(intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };
}, [isPlaying]);
return ( 
    <div style={{ width:'80%', height: 4, backgroundColor: 'lightgray' }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', backgroundColor: 'blue' }} />
    </div>
)
}