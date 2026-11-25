<?php

declare(strict_types=1);

namespace App\Events\Processes;

/**
 * A run's result receipt was replaced by a newer one.
 */
final readonly class ResultReceiptSuperseded implements ProcessEvent
{
    public function __construct(
        public string $receiptId,
        public string $supersededById,
    ) {}
}
