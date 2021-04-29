
class Speach{


    static speak(txt){

        let speaker = new SpeechSynthesisUtterance();
        
        speaker.text = txt;
        speaker.voice=window.speechSynthesis.getVoices()[1];

        speaker.pitch=1;
        speaker.rate=1;

        window.speechSynthesis.speak(speaker);
    }
}