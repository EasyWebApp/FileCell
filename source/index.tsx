import {
    WebFieldProps,
    component,
    WebField,
    observer,
    createCell,
    Fragment
} from 'web-cell';
import { observable } from 'mobx';

export interface UploadHandler {
    progress?: {
        [Symbol.asyncIterator](): AsyncGenerator<ProgressEvent>;
    };
    path: Promise<string>;
}

export type UploadEvent = CustomEvent<{
    file: File;
    path: string;
}>;

declare global {
    interface HTMLElementEventMap {
        upload: UploadEvent;
    }
}

export interface FileCellProps extends WebFieldProps {
    transport(file: File): UploadHandler;
    onUpload?(event: UploadEvent): any;
}

@component({
    tagName: 'file-cell'
})
@observer
export class FileCell extends WebField<FileCellProps>() {
    @observable
    transport: FileCellProps['transport'];

    @observable
    percent: number;

    formAssociatedCallback(form: HTMLFormElement) {
        form.addEventListener('submit', this.upload);
    }

    upload = async () => {
        const files = Array.from(
            this.querySelectorAll('*'),
            field => 'files' in field && [...(field as HTMLInputElement).files]
        )
            .filter(Boolean)
            .flat(2);

        const sum = files.reduce((sum, { size }) => sum + size, 0);
        var finished = 0;

        for (const file of files) {
            const { progress, path } = this.transport(file);

            if (progress)
                for await (const { loaded } of progress)
                    this.percent = ((finished + loaded) / sum) * 100;

            finished += file.size;

            this.percent = (finished / sum) * 100;

            this.emit('upload', { file, path: await path });
        }
    };

    render() {
        const { defaultSlot, percent } = this;

        return (
            <>
                <progress className="mb-2" value={percent} />
                {defaultSlot}
            </>
        );
    }
}
