<?php

declare(strict_types=1);

namespace Domain\Comments\Data;

use App\Data\Pages\RecordCard;
use App\Values\TextAnchor;
use Domain\Comments\Contracts\CommentView;
use Domain\Comments\Enums\CommentType;
use Spatie\LaravelData\Attributes\Computed;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A comment about a place in the record's text, as a list shows it, with the place it points at.
 */
#[TypeScript]
final class TextCommentView extends Data implements CommentView
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
