import React, {Component} from 'react';
import logo from './logo.svg';
//import myImage from './foo.jpg';
import './App.css';
import {Tesseract} from "tesseract.ts";
import ImageUploader from 'react-images-upload';
import Speech from 'speak-tts'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pictures: [],
            pictureDataURLs: [],
            progress: 0,
            inProgress: false,
            progressStatus: "waiting for image",
            recognizedTexts:[]
        };
        this.onDrop = this.onDrop.bind(this);
    }

    onDrop(pictureFiles, pictureDataURLs) {
        this.setState({
            //pictures: this.state.pictures.concat(pictureFiles),
            pictureDataURLs: pictureDataURLs ? pictureDataURLs : []
        })
        //console.log("uploaded: ", this.state.pictures)
        //console.log("pictureFiles: ", pictureFiles);
        //console.log("pictureDataURLs: ", pictureDataURLs);
    }

    componentDidMount() {
        console.log("App componentDidMount")
        //Tesseract
        //    .recognize(myImage)
        //    .progress(console.log)
        //    .then((res) => {
        //        console.log(res);
        //    })
        //    .catch(console.error);
    }

    componentDidUpdate(prevProps, prevState) {
       // console.log('this.state.pictureDataURLs:', this.state.pictureDataURLs)

        if (this.state.pictureDataURLs !== prevState.pictureDataURLs) {
            if (this.state.pictureDataURLs.length > prevState.pictureDataURLs.length) {
                Tesseract
                    .recognize(this.state.pictureDataURLs[this.state.pictureDataURLs.length - 1])
                    .progress((progress)=>{
                    console.log(progress)
                        this.setState({
                         progress:Math.round(progress.progress * 100) / 100,

                         inProgress: progress.progress===1?false:true,
                         progressStatus: progress.progress===1?"waiting for next image":progress.status
                        })
                    })
                    .then((res) => {
                        console.log(res);
                        this.setState({
                            recognizedText:res
                        })
                    }).catch(console.error)
            }
        }

    }
    play(){
        console.log("start reading")
        const speech = new Speech()
        speech.init({
            'volume': 1,
            //'lang': 'en-GB',
            'lang': 'pl-PL',
            'rate': 1,
            'pitch': 1,
            //'voice':'Google UK English Male',
            'splitSentences': true,
            'listeners': {
                'onvoiceschanged': (voices) => {
                    console.log("Event voiceschanged", voices)
                }
            }
        })
        speech.speak({
            text: this.state.recognizedText.text,
            queue: false
        }).then(() => {
            console.log("Success !")
        }).catch(e => {
            console.error("An error occurred :", e)
        })
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img style={{width:"60px", height:"60px"}} src={logo} className="App-logo" alt="logo"/>
                    <p>
                        {this.state.progressStatus}
                    </p>
                    <ImageUploader
                        withIcon={true}
                        //withPreview={true}
                        buttonText='Choose images'
                        onChange={this.onDrop}
                        imgExtension={['.jpg', '.png']}
                        maxFileSize={5242880}
                        //singleImage={true}
                    />

                    <p>
                        progress: {this.state.progress*100}%
                    </p>
                    <h3>Recognized text:</h3>
                    {this.state.recognizedText&&<button onClick={()=>this.play()}>read me text</button>}
                    <div>

                        {this.state.recognizedText?this.state.recognizedText.text:""}
                    </div>
                    <h3>Formatted text:</h3>
                    <div dangerouslySetInnerHTML={{__html: this.state.recognizedText?this.state.recognizedText.html:""}} />
                </header>
            </div>
        );
    }
}

export default App;
