<?php

declare(strict_types=1);

namespace App\Events\Messages;

/**
 * A reader's receipt progress moved on to the offset given.
 */
final readonly class ReceiptProgressAdvanced extends MessageEvent
{
    public function __construct(
        public string $progressId,
        public int $offset,
    ) {}
}
