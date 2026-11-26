<?php

declare(strict_types=1);

namespace App\Sharing\Commands\RetryShare;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Bus\Attributes\Commands\RequiresRequestKey;
use App\Policies\SharingPolicy;
use App\Sharing\Support\ShareSummary;
use App\Support\Command;

/**
 * The owner asks the gateway to open a pending or failed share again, before its deadline, which stays the same.
 *
 * @extends Command<ShareSummary>
 */
#[Authorize(SharingPolicy::class, AccessType::Edit)]
#[RequiresRequestKey(retentionDays: 31, refusalDays: 365)]
final readonly class RetryShareCommand extends Command
{
    public function __construct(
        public string $shareId,
        public string $requestKey,
    ) {}
}
