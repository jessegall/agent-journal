<?php

declare(strict_types=1);

namespace App\Policies;

use App\Contracts\Policy;
use App\Models\Comment;

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
