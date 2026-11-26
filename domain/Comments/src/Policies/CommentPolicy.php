<?php

declare(strict_types=1);

namespace Domain\Comments\Policies;

use App\Access\Contracts\Policy;
use Domain\Comments\Models\Comment;

/**
 * Who may work with comments: every granted actor, so the grants decide.
 */
final readonly class CommentPolicy implements Policy
{
    public static function model(): string
    {
        return Comment::class;
    }
}
