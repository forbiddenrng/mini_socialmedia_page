export default function Post({title, createDate, modifyDate, content, ownerId}){
  return(
    <div className="post">
      <h3>{title}</h3>
      <span>Post użytkownika: {ownerId}</span>
      {modifyDate === null ? <span>Data posta:{createDate}</span> : <span>Data edycji:{modifyDate}</span>}
      <p>{content}</p>
    </div>
  )
}