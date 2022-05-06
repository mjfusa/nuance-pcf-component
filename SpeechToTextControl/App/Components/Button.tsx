import * as React from 'react';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Icon } from '@fluentui/react/lib/Icon';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
const iconPropsRecord = 'CircleFill';
const iconPropsStop = 'StopSolid';


export interface IButtonProps {
    // These are set based on the toggles shown above the examples (not needed in real code)
    disabled?: boolean;
    checked?: boolean;
    isRecording: boolean;
    buttonColorHEX?: string | null;
    buttonTextColorHEX?: string | null;
    buttonColorHoveredHEX?: string | null;
    buttonTextColorHoveredHEX?: string | null;
    buttonColorPressedHEX?: string | null;
    buttonTextColorPressedHEX?: string | null;
    iconColorRecordHEX?: string | null;
    iconColorStopHEX?: string | null;
    onClick?: () => void;
    showRecordingButton: boolean;
}


export const ButtonCompound: React.FunctionComponent<IButtonProps> = props => {
    const { disabled, checked } = props;
    var buttonText = props.isRecording ? "Stop" : "Record";

    const classNames = mergeStyleSets({
        iconColorRecord: {
            color: `${props.iconColorRecordHEX}`
        },
        iconColorStop: {
            color: `${props.iconColorStopHEX}`
        }
    });

    const btnStyles = {
        rootHovered: {
            backgroundColor: `${props.buttonColorHoveredHEX}`,
            color: `${props.buttonTextColorHoveredHEX}`
        },
        rootPressed: {
            backgroundColor: `${props.buttonColorPressedHEX}`,
            color: `${props.buttonTextColorPressedHEX}`
        },
        root: {
            backgroundColor: `${props.buttonColorHEX}`,
            color: `${props.buttonTextColorHEX}`
        }
    };

    var render = props.showRecordingButton ? (<PrimaryButton
        onClick={props.onClick}
        text={buttonText}
        title={buttonText}
        ariaLabel={buttonText}
        styles={btnStyles}
    >
        <Icon iconName={props.isRecording ? iconPropsStop : iconPropsRecord}
            className={props.isRecording ? classNames.iconColorStop : classNames.iconColorRecord}
        />
    </PrimaryButton>) : <React.Fragment></React.Fragment>;

    return (
        render
    );
};