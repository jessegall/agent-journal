<?php

declare(strict_types=1);

namespace App\Events;

/**
 * A range of delivered messages was confirmed.
 */
final readonly class MessageRangeConfirmed extends MessageEvent
{
    public function __construct(
        public string $rangeId,
    ) {}
}
