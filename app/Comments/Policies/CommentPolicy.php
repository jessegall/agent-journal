<?php

declare(strict_types=1);

namespace App\Comments\Policies;

use App\Actors\Contracts\Policy;
use App\Comments\Models\Comment;

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
