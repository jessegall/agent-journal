<?php

declare(strict_types=1);

namespace Domain\Comments\Api;

use Spatie\LaravelData\Data;

/**
 * The comment a post made, or found again under its submission key.
 */
final class CommentPosted extends Data
{
    public function __construct(public string $comment) {}
}
