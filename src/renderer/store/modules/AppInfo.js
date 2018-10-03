import { remote } from 'electron'
import path from 'path'

const state = {
  appPath: remote.app.getAppPath(),
  userDataDir: remote.app.getPath('userData'),
  workflowsDir: path.join(remote.app.getPath('userData'), '/workflows')
}

export default {
  state
}
