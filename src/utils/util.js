export function formatTime(timestamp) {
  const date = new Date(parseInt(timestamp))
  const Y = date.getFullYear()
  const M = date.getMonth() + 1
  const D = date.getDate()
  const h = date.getHours()
  const m = date.getMinutes()
  const s = date.getSeconds()
  return `${Y}-${M}-${D} ${h}:${m}:${s}`
}
