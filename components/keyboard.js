export default function Keyboard({kind, isPBT, filter}) {
  const kindDir = {
    0: 'eighty-percent', 
    1: 'iso-105',
    2: 'seventy-five-percent', 
    3: 'sixty-percent',
  }[kind]

  const fileName = isPBT ? 'PBT' : 'ABS'

  const imagePath = `keyboards/${kindDir}/${fileName}.png`;
  const alt = `${kindDir} keyboard with ${isPBT? "PBT" : "ABS"} keys ${filter? `with ${filter}` : ""}`;

  return (
    <div className="rounded-lg p-2 border border-white">
      <img className={"h-[230px] w-[360px] " + filter} src={imagePath} alt={alt} />
    </div>
  )}