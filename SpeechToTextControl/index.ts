import React = require("react");
import ReactDOM = require("react-dom");
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { App, IAppProps } from "./App/App";
import { CookiesProvider, Cookies } from "react-cookie";

export class SpeechToTextCtrl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private _container: HTMLDivElement;
	private _notifyOutputChanged: () => void;
	private _transformedText: string;


	private _props: IAppProps = {
		webAPI: undefined,
		userSettings: undefined,
		//callback function
		notifyOutputChange: this.notifyOutputChange.bind(this),
		pcfHeight: "",
		pcfWidth: "",
		NUSA_userId: "",
		NUSA_applicationName: "",
		NUSA_Guids: "",
		NUSA_service: "",
		NUSA_language: "",
		transformedText: "",
		cookies: new Cookies("NUSA_Guids"),
		stackTokens: { childrenGap: 30 },
		buttonColorHEX: "",
		buttonTextColorHEX: "",
		iconColorRecordHEX: "",
		iconColorStopHEX: "",
		buttonColorHoveredHEX: "",
		buttonTextColorHoveredHEX: "",
		buttonColorPressedHEX: "",
		buttonTextColorPressedHEX:"",
		isRecording:false,
		showRecordingButton:true
	};
	/**
	 * Empty constructor.
	 */
	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
		this._container = container;
		this._notifyOutputChanged = notifyOutputChanged;
		context.mode.trackContainerResize(true);
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		// storing the latest context from the control.
		this.renderApp(context);
	}

	private notifyOutputChange(transformedText: string): void {

		this._transformedText = transformedText;

		this._notifyOutputChanged();
	};

	private renderApp(context: ComponentFramework.Context<IInputs>) {

		this._props.webAPI = context.webAPI;
		this._props.userSettings = context.userSettings;
		this._props.NUSA_userId = context.parameters.NUSA_userId.raw;
		this._props.NUSA_applicationName = context.parameters.NUSA_applicationName.raw;
		this._props.NUSA_Guids = context.parameters.NUSA_Guids.raw;
		this._props.NUSA_service = context.parameters.NUSA_service.raw;
		this._props.NUSA_language = context.parameters.NUSA_language.raw;
		this._props.transformedText = context.parameters.TransformedText.raw;
		this._props.buttonColorHEX = context.parameters?.buttonColorHEX?.raw;
		this._props.buttonTextColorHEX = context.parameters?.buttonTextColorHEX?.raw;
		this._props.buttonColorHoveredHEX = context.parameters?.buttonColorHoveredHEX?.raw;
		this._props.buttonTextColorHoveredHEX = context.parameters?.buttonTextColorHoveredHEX?.raw;
		this._props.buttonColorPressedHEX = context.parameters?.buttonColorPressedHEX?.raw;
		this._props.buttonTextColorPressedHEX = context.parameters?.buttonTextColorPressedHEX?.raw;
		this._props.iconColorRecordHEX = context.parameters?.iconColorRecordHEX?.raw;
		this._props.iconColorStopHEX = context.parameters?.iconColorStopHEX?.raw;
		this._props.isRecording = new Boolean(Number(context.parameters?.isRecording?.raw)).valueOf();
		this._props.showRecordingButton = new Boolean(Number(context.parameters?.showRecordingButton?.raw)).valueOf();

		if (context.parameters?.gapBetweenElements?.raw) {
			this._props.stackTokens = { childrenGap: context.parameters?.gapBetweenElements?.raw }
		}

		//@ts-ignore
		this._props.pcfHeight = context.client?.allocatedHeight;
		//@ts-ignore
		this._props.pcfWidth = context.client?.allocatedWidth;


		var app = React.createElement(App, this._props);
		var rootElement = React.createElement(CookiesProvider, {}, app);
		ReactDOM.render(
			rootElement,
			this._container
		);
	}

	/**
	 * It is called by the framework prior to a control receiving new data.
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return {
			TransformedText: this._transformedText,
		};
	}

	/**
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
		ReactDOM.unmountComponentAtNode(this._container);
	}
}
