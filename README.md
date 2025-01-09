## install-optional

Install and remove optional dependencies

```typescript
import { install, installSync, removeSync } from 'install-optional';

// removes all optional dependencies with @esbuild/ in their name
removeSync('esbuild', '@esbuild/');

// removes all optional dependencies for this platform - sync
installSync('esbuild', `${process.platform}-${process.arch}`);

// removes all optional dependencies for this platform - async
await install('esbuild', `${process.platform}-${process.arch}`)
```

### Documentation

[API Docs](https://kmalakoff.github.io/install-optional/)
