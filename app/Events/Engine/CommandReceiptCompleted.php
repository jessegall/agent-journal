<?php

declare(strict_types=1);

namespace App\Events\Engine;

use App\Engine\Contracts\Work\CommandReceiptEvent;

/**
 * A command's receipt kept its reply, so a repeat of its request key replays it.
 */
final readonly class CommandReceiptCompleted implements CommandReceiptEvent, EngineEvent
{
    public function __construct(
        public string $receiptId,
    ) {}
}
