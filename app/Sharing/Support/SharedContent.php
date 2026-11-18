<?php

declare(strict_types=1);

namespace App\Sharing\Support;

/**
 * The published content of one shared record: its card and its Markdown body as published, never a draft.
 */
final readonly class SharedContent
{
    public function __construct(
        public ShareRecordCard $card,
        public string $body,
    ) {}
}
