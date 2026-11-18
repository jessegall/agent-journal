<?php

declare(strict_types=1);

namespace App\Comments\Data;

use App\Comments\Enums\CommentType;
use App\Records\Data\RecordCard;
use Spatie\LaravelData\Attributes\Computed;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A comment about the whole record, as a list shows it.
 */
#[TypeScript]
final class RecordCommentView extends Data
{
    #[Computed]
    #[LiteralTypeScriptType("'record'")]
    public CommentType $type {
        get => CommentType::Record;
    }

    public function __construct(
        public readonly RecordCard $target,
        public readonly CommentDetails $comment,
    ) {}
}
