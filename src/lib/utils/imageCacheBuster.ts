export function imageCacheBuster(url: string) {
  return `${url}?ts=${new Date().getTime()}`;
}
