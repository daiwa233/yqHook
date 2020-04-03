module.exports = {
  // 给md字符串添加fontmatter
  addFontMatter({contentDraft, author=dva, title, created_at, name}) {
    const fontmatter = 
    `---
      author: ${author}
      title: ${title}
      date: ${created_at}
      category: ['${name}']
      tags: ['${name}']
---\n`;
    return fontmatter + contentDraft
  }
  
}