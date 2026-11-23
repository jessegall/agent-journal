<?php

declare(strict_types=1);

namespace App\Data\Connections;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The comments on one range of a file's lines in the version the window shows, the first one and its replies in the
 * order they were written.
 */
#[TypeScript]
final class FileThreadData extends Data
{
    /**
     * @param  list<FileCommentData>  $comments
     */
    public function __construct(
        public readonly int $firstLine,
        public readonly int $lastLine,
        public readonly string $quote,
        public readonly string $versionLabel,
        #[DataCollectionOf(FileCommentData::class)]
        public readonly array $comments,
    ) {}
}
