# FileCell

**File Uploader** element based on [Web Components][1] & [WebCell v2][2]

[![NPM Dependency](https://david-dm.org/EasyWebApp/FileCell.svg)][3]
[![CI & CD](https://github.com/EasyWebApp/FileCell/workflows/CI%20&%20CD/badge.svg)][4]

[![NPM](https://nodei.co/npm/file-cell.png?downloads=true&downloadRank=true&stars=true)][5]

## Example

### JSX usage

```tsx
import { documentReady, render, createCell } from 'web-cell';
import { FileCellProps, FileCell } from 'file-cell';
import { MarkdownEditor } from 'markdown-area-element';

const upload: FileCellProps['transport'] = async file => {
    const response = await fetch('/file', {
        method: 'POST',
        body: file
    });
    const { path } = await response.json();

    return { path };
};

documentReady.then(() =>
    render(
        <FileCell transport={upload}>
            <MarkdownEditor name="markdown">default text</MarkdownEditor>
        </FileCell>
    )
);
```

### Listen Upload event

https://github.com/EasyWebApp/markdown-area-element/blob/d9930bb/source/Editor.tsx#L65-L68

### Update File URL

https://github.com/EasyWebApp/markdown-area-element/blob/d9930bb/source/Editor.tsx#L80-L85

[1]: https://www.webcomponents.org/
[2]: https://web-cell.dev/
[3]: https://david-dm.org/EasyWebApp/FileCell
[4]: https://github.com/EasyWebApp/FileCell/actions
[5]: https://nodei.co/npm/file-cell/
