<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Contracts\Command;
use App\Sharing\Handlers\RetryShareHandler;
use App\Sharing\Support\ShareSummary;

/**
 * The owner asks the gateway to open a pending or failed share again, before its deadline, which stays the same.
 *
 * @implements Command<ShareSummary>
 */
#[HandledBy(RetryShareHandler::class)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
final readonly class RetryShare implements Command
{
    public function __construct(
        public string $shareId,
        public string $requestKey,
    ) {}
}
