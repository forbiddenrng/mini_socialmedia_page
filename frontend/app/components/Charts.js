import "../style/charts.css"
export default function Charts({charts}){
  const sortedCharts = charts.sort((c1,c2) => c2.votes - c1.votes)
  return (
    <div className="charts_container">
    <div className="charts">
      <div className="header">
        <p className="position">Miejsce</p>
        <p className="info">Utwór i artysta</p>
        <p className="votes">Głosy</p>
      </div>
      {sortedCharts.map((chart,i) => (<div className="song" key={chart.id}>
      <div className="position">{i+1}</div>
      <div className="song_info">
        <p className="song_title">{chart.song}</p>
        <p className="song_author">{chart.artist}</p>
      </div>
      <div className="song_votes">
        <p>{chart.votes}</p>
      </div>
    </div>))}</div>
    </div>
  )
}