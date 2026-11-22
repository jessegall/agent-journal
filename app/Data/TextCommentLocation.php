<?php

declare(strict_types=1);

namespace App\Data;

use App\Enums\CommentType;
use App\Support\TextPart;
use App\Values\TextAnchor;
use Spatie\LaravelData\Attributes\Computed;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where a text comment leads: the record, the place in its text and the lines around it from the version it was left
 * on.
 */
#[TypeScript]
final class TextCommentLocation extends Data
{
    #[Computed]
    #[LiteralTypeScriptType("'text'")]
    public CommentType $type {
        get => CommentType::Text;
    }

    public function __construct(
        public readonly RecordCard $target,
        public readonly TextAnchor $anchor,
        public readonly TextPart $part,
    ) {}
}
