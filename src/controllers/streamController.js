import { sendCurrentPlaylistSound, sendNextSound } from "../services/streamService.js";

let wsClient = null;

export const handleStream = ws => {
    wsClient = ws;
    sendCurrentPlaylistSound();
    ws.on('message', msg => {
        let data;
        try {
            data = JSON.parse(msg);
        } catch (e) {
            return;
        }
        switch (data.action) {
            case 'end':
                if (data.type === 'playlist') {
                    sendNextSound();
                    return
                }
                if (data.type === 'single') {
                    sendCurrentPlaylistSound();
                    return

                }
                if (data.type === 'schedule') {
                    sendCurrentPlaylistSound();
                    return
                }

                break;
        }
    });
    ws.on('close', () => {
        wsClient = null;
    });
};

export const sendPlayCommand = command => {
    if (wsClient && wsClient.readyState === 1) {
        wsClient.send(JSON.stringify(command));
    }
};