import ExpoErrorRecovery from './ExpoErrorRecovery';
import { Platform } from 'react-native';
let recoveredPropsToSave = null;
let globalHandler;
if (Platform.OS !== 'web') {
    globalHandler = ErrorUtils.getGlobalHandler();
    // ErrorUtils came from react-native
    // https://github.com/facebook/react-native/blob/1151c096dab17e5d9a6ac05b61aacecd4305f3db/Libraries/vendor/core/ErrorUtils.js#L25
    ErrorUtils.setGlobalHandler(async (error, isFatal) => {
        if (ExpoErrorRecovery.saveRecoveryProps) {
            await ExpoErrorRecovery.saveRecoveryProps(recoveredPropsToSave);
        }
        globalHandler(error, isFatal);
    });
}
else {
    globalHandler = window.onerror;
    window.onerror = function () {
        ExpoErrorRecovery.saveRecoveryProps(recoveredPropsToSave);
        if (globalHandler) {
            return globalHandler.apply(arguments);
        }
        return false;
    };
}
export const recoveredProps = _getRecoveredProps();
export function setRecoveryProps(props) {
    recoveredPropsToSave = JSON.stringify(props);
}
function _getRecoveredProps() {
    if (ExpoErrorRecovery.recoveredProps) {
        return JSON.parse(ExpoErrorRecovery.recoveredProps);
    }
    return null;
}
//# sourceMappingURL=ErrorRecovery.js.map