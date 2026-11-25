// The shared kit a domain's components import as @kit/loaders: one loader call by a same-page partial reload, alone
// or riding on a write, and the generated descriptors of every declared loader.
export { load, loadAfter, LoaderCancelled, LoaderFailed } from '@/framework/loaders';
export type { Loader, LoaderAnswer } from '@/framework/loaders';
export * from '@/generated/loaders';
