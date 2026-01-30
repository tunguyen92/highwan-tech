declare module 'file-saver' {
  export type SaveAsOptions = Record<string, unknown>
  export function saveAs(
    data: BlobPart,
    filename?: string,
    options?: SaveAsOptions
  ): void
}
