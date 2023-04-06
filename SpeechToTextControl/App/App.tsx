import * as React from 'react';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';
import { ButtonCompound } from './Components/Button';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { instanceOf } from 'prop-types';
import {  Cookies } from 'react-cookie';

export interface IAppProps {
    notifyOutputChange: any;
    webAPI?: ComponentFramework.WebApi;
    userSettings?: ComponentFramework.UserSettings;
    pcfHeight?: string;
    pcfWidth?: string;
    NUSA_userId: string | null;
    NUSA_language?: string | null;
    NUSA_applicationName?: string | null;
    NUSA_Guids?: string | null;
    NUSA_service?: string | null;
    cookies: Cookies;
    transformedText?: string | null;
    stackTokens: IStackTokens;
    buttonColorHEX?: string | null;
    buttonTextColorHEX?: string | null;
    iconColorRecordHEX?: string | null;
    iconColorStopHEX?: string | null;
    buttonColorHoveredHEX?: string | null;
    buttonTextColorHoveredHEX?: string | null;
    buttonColorPressedHEX?: string | null;
    buttonTextColorPressedHEX?: string | null;
    isRecording:boolean;
    showRecordingButton:boolean;
}

export interface IAppState {
    transformedText?: string | null;
    isRecording: boolean;
    isNusaLibLoaded: boolean;
    isNusaLibLoading: boolean;
    supportedLanguages: string[];
    NUSA_userId: string | null;
    NUSA_language?: string | null;
}

export class App extends React.Component<IAppProps, IAppState>{
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props: IAppProps) {
        super(props);

        const { cookies } = props;
        this.state = {
            transformedText: "",
            NUSA_userId: "",
            NUSA_language: "",
            isRecording: false,
            isNusaLibLoaded: false,
            isNusaLibLoading: false,
            supportedLanguages: [
                "sv-SE",
                "da-DK",
                "en-US",
                "ca",
                "da",
                "nl",
                "en",
                "fi",
                "fr-FR",
                "de-DE",
                "hu",
                "it",
                "no",
                "pt",
                "sl",
                "es",
                "sv",
            ]

        };
    };

    componentWillMount() {
        initializeIcons();
    }

    async componentDidMount() {
        //@ts-ignore
        if (this.props.NUSA_userId && !this.state.isNusaLibLoaded) {
            var loaded = await this.setUpNuance();

            if (loaded) {
                this.setState({ isNusaLibLoaded: true });
                this.setState({ isNusaLibLoading: false });
            }
           
        }
    }

    componentWillUnmount() {
        //@ts-ignore
        if (typeof NUSA_closeVuiForm != undefined) {
            //@ts-ignore
            NUSA_closeVuiForm();
        }
    }

    async componentDidUpdate(prevProps: IAppProps) {
        //@ts-ignore
        if (this.props.NUSA_userId && !this.state.isNusaLibLoading && !this.state.isNusaLibLoaded) {
            var loaded = await this.setUpNuance();
            if (loaded) {
                this.setState({ isNusaLibLoaded: true });
                this.setState({ isNusaLibLoading: false });
                this.Nusa_langugageUpdatedReInitialize();
                this.Nusa_userIdUpdatedReInitialize();
            }
        }

        if (this.state.isNusaLibLoading)
            return;

        if (prevProps.transformedText != this.props.transformedText) {
            this.setState({ transformedText: this.props.transformedText });
        }

        if (!this.state.isNusaLibLoaded)
            return;

        this.Nusa_langugageUpdatedReInitialize(prevProps);
        this.Nusa_userIdUpdatedReInitialize();

        if(this.props.showRecordingButton == false && prevProps.isRecording != this.props.isRecording)
            this.callNuanceSDK();

    }

    private Nusa_langugageUpdatedReInitialize(prevProps?: IAppProps) {
        if (prevProps && prevProps.NUSA_language != this.props.NUSA_language && this.state.supportedLanguages.find((lang) => lang.toLowerCase() == this.props.NUSA_language?.toLowerCase())) {
            //@ts-ignore 
            if (typeof NUSA_closeVuiForm != undefined && typeof NUSA_initializeVuiForm != undefined) {
                if (prevProps.NUSA_language != this.props.NUSA_language) {
                    this.setState({ NUSA_language: this.props.NUSA_language });
                }
               //@ts-ignore
                NUSA_closeVuiForm();
                //@ts-ignore
                if (NUSA_language != this.props.NUSA_language) {
                    //@ts-ignore
                    NUSA_language = this.props.NUSA_language;
                }
                //@ts-ignore
                NUSA_initializeVuiForm();
            }
        }
    }

    private Nusa_userIdUpdatedReInitialize(prevProps?: IAppProps) {
        if (this.state.NUSA_userId != this.props.NUSA_userId && this.props.NUSA_userId != null) {
            //@ts-ignore
            if (typeof NUSA_closeVuiForm != undefined && typeof NUSA_initializeVuiForm != undefined) {
                this.setState({ NUSA_userId: this.props.NUSA_userId });
                //@ts-ignore
                NUSA_closeVuiForm();
                //@ts-ignore
                if (NUSA_userId != this.props.NUSA_userId) {
                    //@ts-ignore
                    NUSA_userId = this.props.NUSA_userId;
                }
                //@ts-ignore
                NUSA_initializeVuiForm();
            }
        }
    }

    private setUpNuance() {
        return new Promise((resolve, reject) => {
            //@ts-ignore
            if(typeof NUSAI_AudioWorkletNode == 'function'){
                resolve(true);
                return;
            }
            
            this.setState({ isNusaLibLoading: true });
            this.initNusa();

            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "https://speechanywhere.nuancehdp.com/mainline/scripts/Nuance.SpeechAnywhere.js";
            script.id = "nuance-lib";
            document.getElementsByTagName("head")[0].appendChild(script);
            resolve(true);
        });

    }

   
    private initNusa() {
        this.setCookieValue(`${this.props.NUSA_Guids}`);
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.innerText = `
        function NUSA_configure(){
            NUSA_userId = '${this.props.NUSA_userId}';
            NUSA_applicationName = '${this.props.NUSA_applicationName}'; 
            document.cookie='NUSA_Guids=${this.props.NUSA_Guids}'; 
            NUSA_service = '${this.props.NUSA_service}';
            NUSA_enableAll = false;
            NUSA_language = '${this.props.NUSA_language}';
        }`; //se till att NUSA_userId inte är ""
        script.id = "nuance-config";
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    private setCookieValue(value?: string) {
        const { cookies } = this.props;
        cookies.set('NUSA_Guids', value, { path: '/' });
    }

    private callNuanceSDK() {
        let guids: string[] = this.props.NUSA_Guids ? this.props.NUSA_Guids.split("/") : [];

        //@ts-ignore
        NUSAI.Data.licenseGuid = guids[0];
        //@ts-ignore
        NUSAI.Data.partnerGuid = guids[1];

        this.setState((prev) => {
            return {
                isRecording: !this.state.isRecording
            }
        });

        if (this.state.isRecording) {
            //@ts-ignore
            window.NUSA_stopRecording();
        }
        else {
            //@ts-ignore
            window.NUSA_startRecording();
        }

        this.props.notifyOutputChange(this.state.transformedText);
    }

    private textAreaOnChange(event: any) {
        this.setState({ transformedText: event.target.value });
        this.props.notifyOutputChange(event.target.value);
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }


    render() {
        var textAreaHeight = Number(this.props.pcfHeight) - 50;
        var textAreaWidth = Number(this.props.pcfWidth);
        const classNames = mergeStyleSets({
            textArea: {
                height: this.props.pcfHeight ? `${textAreaHeight}px` : "300px",
                resize: 'none',
                width: `${textAreaWidth}px`
            },
        });

        return (
            <div>
                <Stack tokens={this.props.stackTokens}>
                    <ButtonCompound
                        isRecording={this.state.isRecording} 
                        showRecordingButton={this.props.showRecordingButton}
                        onClick={this.callNuanceSDK.bind(this)}
                        buttonColorHEX={this.props.buttonColorHEX}
                        buttonTextColorHEX={this.props.buttonTextColorHEX}
                        iconColorRecordHEX={this.props.iconColorRecordHEX}
                        iconColorStopHEX={this.props.iconColorStopHEX}
                        buttonColorHoveredHEX={this.props.buttonColorHoveredHEX}
                        buttonTextColorHoveredHEX={this.props.buttonTextColorHoveredHEX}
                        buttonColorPressedHEX={this.props.buttonColorPressedHEX}
                        buttonTextColorPressedHEX={this.props.buttonTextColorPressedHEX}
                    />
                    <textarea value={this.state.transformedText != null ? this.state.transformedText : ''} id="speech-to-text-ta-multi" className={classNames.textArea} disabled={false} data-nusa-enabled={true} onChange={this.textAreaOnChange.bind(this)} onBlur={this.textAreaOnChange.bind(this)} />
                </Stack>
            </div>
        );
    }
}