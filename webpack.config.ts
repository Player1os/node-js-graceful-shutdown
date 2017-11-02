// Load runtime module.
import '@player1os/node-utility/runtime'

// Load scoped modules.
import { nodeLibraryConfig } from '@player1os/webpack-config'

// Expose the configuration object.
export default nodeLibraryConfig(__dirname)
