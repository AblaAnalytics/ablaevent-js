import { loadScript } from '../autocapture-utils'
import { _ } from '../utils'
import { SESSION_RECORDING_ENABLED } from '../posthog-persistence'
import sessionIdGenerator from './sessionid'

export class SessionRecording {
    constructor(instance) {
        this.instance = instance
        this.captureStarted = false
        this.snapshots = []
        this.emit = false
    }

    startRecordingIfEnabled() {
        if (this.instance.get_property(SESSION_RECORDING_ENABLED)) {
            this._startCapture()
        }
    }

    afterDecideResponse(response) {
        if (this.instance.persistence) {
            this.instance.persistence.register({ [SESSION_RECORDING_ENABLED]: !!response['sessionRecording'] })
        }

        if (response['sessionRecording']) {
            this.submitRecordings()
        }
    }

    submitRecordings() {
        this.emit = true
        this._startCapture()
        this.snapshots.forEach((properties) => {
            this.instance.capture('$snapshot', properties)
        })
    }

    _startCapture() {
        if (!this.captureStarted && !this.instance.get_config('disable_session_recording')) {
            this.captureStarted = true
            loadScript(this.instance.get_config('api_host') + '/static/recorder.js', _.bind(this._onScriptLoaded, this))
        }
    }

    _onScriptLoaded() {
        // rrweb config info: https://github.com/rrweb-io/rrweb/blob/7d5d0033258d6c29599fb08412202d9a2c7b9413/src/record/index.ts#L28
        window.rrweb.record({
            emit: (data) => {
                const properties = {
                    $snapshot_data: data,
                    $session_id: sessionIdGenerator(this.instance.persistence, data.timestamp),
                }

                if (this.emit) {
                    this.instance.capture('$snapshot', properties)
                } else {
                    this.snapshots.push(properties)
                }
            },
            blockClass: 'ph-no-capture', // Does not capture the element at all
            ignoreClass: 'ph-ignore-input', // Ignores content of input but still records the input element
        })
    }
}
