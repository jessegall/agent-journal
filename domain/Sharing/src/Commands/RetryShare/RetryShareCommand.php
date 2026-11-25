<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\RetryShare;

use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\RequiresRequestKey;
use App\Enums\Agents\AccessType;
use Domain\Sharing\Policies\SharingPolicy;
use App\Support\Command;
use Domain\Sharing\Support\ShareSummary;

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
