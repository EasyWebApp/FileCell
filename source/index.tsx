import {
    WebFieldProps,
    WebFieldState,
    component,
    mixinForm,
    watch,
    createCell,
    Fragment
} from 'web-cell';

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

interface FileCellState extends WebFieldState {
    percent: number;
}

@component({
    tagName: 'file-cell',
    renderTarget: 'children'
})
export class FileCell extends mixinForm<FileCellProps, FileCellState>() {
    @watch
    transport: FileCellProps['transport'];

    state = { percent: 0 };

    get percent() {
        return this.state.percent;
    }

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
                    await this.setState({
                        percent: ((finished + loaded) / sum) * 100
                    });
            finished += file.size;

            await this.setState({ percent: (finished / sum) * 100 });

            this.emit('upload', { file, path: await path });
        }
    };

    render({ defaultSlot }: FileCellProps, { percent }: FileCellState) {
        return (
            <>
                <progress className="mb-2" value={percent} />
                {defaultSlot}
            </>
        );
    }
}
