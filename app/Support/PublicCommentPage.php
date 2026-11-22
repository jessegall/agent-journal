<?php

declare(strict_types=1);

namespace App\Support;

/**
 * One page of a parent's comments, oldest first, and where the next page starts, or null on the last.
 */
final readonly class PublicCommentPage
{
    /**
     * @param  list<PublicComment>  $comments
     */
    public function __construct(
        public array $comments,
        public string|null $next,
    ) {}
}
