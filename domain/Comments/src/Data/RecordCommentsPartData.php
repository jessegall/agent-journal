<?php

declare(strict_types=1);

namespace Domain\Comments\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The props of a record's comments part: its comments, the record they are on, the revision a new comment is on
 * and who has read it.
 */
#[TypeScript]
final class RecordCommentsPartData extends Data
{
    public function __construct(
        public readonly CommentList $comments,
        public readonly string $target,
        public readonly RecordReadsData|Optional $reads = new Optional(),
        public readonly string|Optional $version = new Optional(),
    ) {}
}
