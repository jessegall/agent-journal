<?php

declare(strict_types=1);

namespace App\Data;

use App\Casts\CommentViewsCast;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One page of a record's comments, oldest first, and the id to read on after, when there are more.
 */
#[TypeScript]
final class CommentList extends Data
{
    /**
     * @param  list<RecordCommentView|TextCommentView>  $comments
     */
    public function __construct(
        #[MapName('items')]
        #[WithCast(CommentViewsCast::class)]
        public readonly array $comments,
        public readonly string|null $nextAfter,
    ) {}
}
