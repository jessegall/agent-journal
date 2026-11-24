<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use App\Data\Comments\CommentList;
use Spatie\LaravelData\Data;
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
        public readonly RecordReadsData $reads,
        public readonly string $version = '1',
    ) {}
}
