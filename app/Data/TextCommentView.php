<?php

declare(strict_types=1);

namespace App\Data;

use App\Enums\CommentType;
use App\Values\TextAnchor;
use Spatie\LaravelData\Attributes\Computed;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A comment about a place in the record's text, as a list shows it, with the place it points at.
 */
#[TypeScript]
final class TextCommentView extends Data
{
    #[Computed]
    #[LiteralTypeScriptType("'text'")]
    public CommentType $type {
        get => CommentType::Text;
    }

    public function __construct(
        public readonly RecordCard $target,
        public readonly CommentDetails $comment,
        public readonly TextAnchor $anchor,
    ) {}
}
