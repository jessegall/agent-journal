<?php

declare(strict_types=1);

namespace App\Data\Connections;

use App\Enums\Connections\FileWindowStatus;
use App\Support\Layout\LayoutBodyData;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A File window: where the chosen file of the connected project stands, its name and path, whether it is Markdown,
 * its lines as read (a file cut short is marked truncated, and each line cut at its length limit is named by its
 * number), a Markdown file's text as the journal's safe HTML, and the digest and size of the version read; no file
 * is chosen when its path is empty. When files take comments, the file's record, once a version of it is kept, takes
 * comments on its lines, and the threads of the version shown come with it, with the project's main agent a comment
 * can be sent to, the address that saves a comment and the one that tells it; with no comments both are null.
 */
#[TypeScript]
final class FileWindowData extends Data
{
    /**
     * @param  list<string>  $lines
     * @param  list<int>  $cutLineNumbers
     * @param  list<FileThreadData>  $threads
     */
    public function __construct(
        public readonly FileWindowStatus $state,
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
