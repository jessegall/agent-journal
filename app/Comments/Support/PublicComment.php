<?php

declare(strict_types=1);

namespace App\Comments\Support;

use App\Records\Support\RecordIdentity;

/**
 * One comment as a public share may show it: the comment, when it was written, the start of its body and the exact
 * text it quoted, if it quoted any. It names no author.
 */
final readonly class PublicComment
{
    public function __construct(
        public RecordIdentity $comment,
        public string $writtenAt,
        public string $excerpt,
        public string|null $quote,
    ) {}
}
