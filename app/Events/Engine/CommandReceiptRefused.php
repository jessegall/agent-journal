<?php

declare(strict_types=1);

namespace App\Events\Engine;

use App\Contracts\Work\CommandReceiptEvent;
use App\Enums\Engine\RefusalCode;

/**
 * A command's receipt kept its refusal, so a repeat of its request key is refused the same way.
 */
final readonly class CommandReceiptRefused extends EngineEvent implements CommandReceiptEvent
{
    public function __construct(
        public string $receiptId,
        public RefusalCode $code,
    ) {}
}
