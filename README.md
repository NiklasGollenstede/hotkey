
# Global HetKeys for Firefox -- WIP

## Development builds -- ![](https://ci.appveyor.com/api/projects/status/github/NiklasGollenstede/hotkey?svg=true)

Development builds are automatically created on every commit with [appveyor](https://ci.appveyor.com/project/NiklasGollenstede/hotkey/history) and published as [release](https://github.com/NiklasGollenstede/hotkey/releases) on GitHub.\
These build use a different id (`-dev` suffix), so they can / have to be installed parallel to the release versions from AMO; only keep one version installed and active.\
Dev versions therefore never update to release versions, but they use the browsers build-in update mechanism to automatically update to the latest dev release. Every release version corresponds to the dev version with the same version prefix and the highest build number.
