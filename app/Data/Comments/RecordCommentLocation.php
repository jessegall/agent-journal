<?php

declare(strict_types=1);

namespace App\Data\Comments;

use App\Data\Pages\RecordCard;
use App\Enums\CommentType;
use Spatie\LaravelData\Attributes\Computed;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where a whole-record comment leads: the record itself.
 */
#[TypeScript]
final class RecordCommentLocation extends Data
{
    #[Computed]
    #[LiteralTypeScriptType("'record'")]
    public CommentType $type {
        get => CommentType::Record;
    }

    public function __construct(
        public readonly RecordCard $target,
    ) {}
}
