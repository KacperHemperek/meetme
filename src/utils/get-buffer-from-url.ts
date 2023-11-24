export async function getBufferFromURL(
  url?: string,
  name?: string,
  contentType?: string,
): Promise<Buffer | undefined> {
  if (!url || !name || !contentType) {
    return;
  }

  const response = await fetch(url);
  const blob = await response.blob();
  const arrBuff = await blob.arrayBuffer();
  return Buffer.from(arrBuff);
}
