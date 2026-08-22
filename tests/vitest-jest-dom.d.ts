// Vitest 3 declares `Assertion` in `@vitest/expect` and only re-exports it from
// `vitest`. jest-dom ships a `declare module 'vitest'` augmentation, which merges
// with the re-export alias instead of the real interface, so its matchers
// (toBeInTheDocument, toBeFocused, …) are not visible to the type-checker here.
// This augments the module that actually declares the interface.
/* eslint-disable @typescript-eslint/no-empty-object-type -- empty interfaces are the point of declaration merging */
import { type TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module '@vitest/expect' {
  interface Assertion<T = any> extends TestingLibraryMatchers<any, T> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<any, any> {}
}
