// @flow

import { translate } from '../../../base/i18n';
import { IconSwitchCamera } from '../../../base/icons';
import { MEDIA_TYPE, toggleCameraFacingMode } from '../../../base/media';
import { connect } from '../../../base/redux';
import { AbstractButton } from '../../../base/toolbox';
import type { AbstractButtonProps } from '../../../base/toolbox';
import { isLocalTrackMuted, getLocalVideoTrack } from '../../../base/tracks';

/**
 * The type of the React {@code Component} props of {@link ToggleCameraButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * Whether the current conference is in audio only mode or not.
     */
    _audioOnly: boolean,

    /**
     * Whether video is currently muted or not.
     */
    _videoMuted: boolean,

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

/**
 * An implementation of a button for toggling the camera facing mode.
 */
class ToggleCameraButton extends AbstractButton<Props, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.toggleCamera';
    icon = IconSwitchCamera;
    label = 'toolbar.toggleCamera';

    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick() {
        this.props.dispatch(toggleCameraFacingMode());
    }

    /**
     * Indicates whether this button is disabled or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isDisabled() {
        return this.props._audioOnly || this.props._videoMuted;
    }
}

/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code ToggleCameraButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _audioOnly: boolean,
 *     _videoMuted: boolean
 * }}
 */
function _mapStateToProps(state): Object {
    const { enabled: audioOnly } = state['features/base/audio-only'];
    const tracks = state['features/base/tracks'];
    const videoMuted = Boolean(isLocalTrackMuted(tracks, MEDIA_TYPE.VIDEO));
    const localVideo = getLocalVideoTrack(tracks);

    let visible = !videoMuted;
    if (localVideo && localVideo.videoType === 'desktop') {
        visible = false;
    }

    return {
        _audioOnly: Boolean(audioOnly),
        _videoMuted: videoMuted,
        visible
    };
}

export default translate(connect(_mapStateToProps)(ToggleCameraButton));
