<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Support\ShareRecordCard;

/**
 * One record a shared page lists: a linked record to go on to, or an owned child such as a comment with its excerpt
 * and quote.
 */
final readonly class SharedPageItem
{
    public function __construct(
        public string $type,
        public string $id,
        public string $title,
        public string|null $excerpt,
        public string|null $quote,
    ) {}

    public static function fromCard(ShareRecordCard $card): self
    {
        return new self($card->record->type, $card->record->id, $card->title, $card->excerpt, $card->quote);
    }
}
