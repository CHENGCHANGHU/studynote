import React from "react";

const chapters = [
  {
    id: 1,
    title: "标题一",
    content: "内容一"
  },
  {
    id: 2,
    title: "标题2",
    content: "内容2"
  },
  {
    id: 3,
    title: "标题3",
    content: "内容3"
  }
];

export default function ChapterContainer() {
  return (
    <div>
      {
        chapters.map(chapter => (
          <div key={chapter.id}>
            <span>{chapter.title}</span>
            <span>{chapter.content}</span>
          </div>
        ))
      }
    </div>
  );
}