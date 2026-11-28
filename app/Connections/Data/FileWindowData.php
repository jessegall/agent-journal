<?php

declare(strict_types=1);

namespace App\Connections\Data;

use App\Connections\Enums\FileWindowStatus;
use App\Connections\Layout\LayoutBodyData;
use App\Web\Creation\Buildable;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A File window: the chosen file's name, path and lines as read (truncated and long lines marked), a Markdown file's
 * safe HTML, and the version's digest and size; an empty path chooses none. When files take comments, the threads of
 * the version shown come with the addresses that save and send a comment.
 */
#[TypeScript]
final class FileWindowData extends Data
{
    /** @use Buildable<FileWindowDataFields> */
    use Buildable;

    protected const string FIELDS = FileWindowDataFields::class;

    /**
     * @param  list<string>  $lines
     * @param  list<int>  $cutLineNumbers
     * @param  list<FileThreadData>  $threads
     */
    public function __construct(
        public readonly FileWindowStatus $status,
        public readonly string $name,
        public readonly string $path,
        public readonly bool $isMarkdown,
        public readonly array $lines,
        public readonly array $cutLineNumbers,
        public readonly bool $isTruncated,
        public readonly string|null $digest,
        public readonly int|null $size,
        public readonly string|null $commentTarget,
        #[DataCollectionOf(FileThreadData::class)]
        public readonly array $threads,
        public readonly string|null $recipientId,
        public readonly string|null $recipientName,
        public readonly string|null $commentAddress,
        public readonly string|null $tellAddress,
        public readonly LayoutBodyData|Optional $markdown = new Optional(),
    ) {}
}
