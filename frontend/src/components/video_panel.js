import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function VideoPanel({ peerSrc, localSrc, config, mediaDevice, status, endCall }) {
  const peerVideo = useRef(null);
  const localVideo = useRef(null);
  const [video, setVideo] = useState(config.video);
  const [audio, setAudio] = useState(config.audio);

  useEffect(() => {
    if (peerVideo.current && peerSrc) peerVideo.current.srcObject = peerSrc;
    if (localVideo.current && localSrc) localVideo.current.srcObject = localSrc;
  });

  useEffect(() => {
    if (mediaDevice) {
      mediaDevice.toggle('Video', video);
      mediaDevice.toggle('Audio', audio);
    }
  });

  /**
   * Turn on/off a media device
   * @param {String} deviceType - Type of the device eg: Video, Audio
   */
  const toggleMediaDevice = (deviceType) => {
    if (deviceType === 'video') {
      setVideo(!video);
      mediaDevice.toggle('Video');
    }
    if (deviceType === 'audio') {
      setAudio(!audio);
      mediaDevice.toggle('Audio');
    }
  };

  return (
        <div className="d-flex app-video-panel">
            <div className="app-video-panel-wrapper">
                {peerSrc ? <video  className="app-video-player" ref={peerVideo} autoPlay/>
                : <img src="./system/screen.png" className=" app-video-player" alt="Cinque Terre" />}
            </div>
            <div className="fade-container app-video-panel-wrapper" style={{alignItems: 'center'}} >
                {localSrc ? <video  className="fade-image app-video-player" ref={localVideo} autoPlay muted/>
                : <img src="./system/screen.png" className="fade-image app-video-player" alt="Cinque Terre" /> }
                <div className="fade-middle d-flex">
                    <div 
                        className="fade-text my-cursor app-btn"
                        onClick={() => toggleMediaDevice('audio')} >
                            audio {audio?"on":"off"}
                    </div>
                    <div 
                        className="fade-text my-cursor app-btn"
                        onClick={() => toggleMediaDevice('video')}>
                            video {video?"on":"off"}
                    </div>
                </div>
            </div>
        </div>
  );
}

VideoPanel.propTypes = {
  localSrc: PropTypes.object, // eslint-disable-line
  peerSrc: PropTypes.object, // eslint-disable-line
  config: PropTypes.shape({
    audio: PropTypes.bool.isRequired,
    video: PropTypes.bool.isRequired
  }).isRequired,
  mediaDevice: PropTypes.object, // eslint-disable-line
};

export default VideoPanel;
