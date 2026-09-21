# OIDC Login SDK Browser
To get completion for the `autherror` event, in the global types file, add the below snippet.

```typescript
declare global {
    interface GlobalEventHandlersEventMap {
        'autherror': CustomEvent<void>
    }
}
```

To define a global types file (i.e. a `typeRoot`), update your `tsconfig.json` file with the following:
```json
{
    "compilerOptions": {
        "typeRoots": [
            "./relative/path/to/global.d.ts"
        ]
    }
}
```
