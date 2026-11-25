<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\RevokeShare;

use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\RequiresRequestKey;
use App\Enums\Agents\AccessType;
use Domain\Sharing\Policies\SharingPolicy;
use App\Support\Command;
use Domain\Sharing\Support\ShareSummary;

/**
 * The owner revokes a share or dismisses a proposal: it ends at once in the database, whether or not its gateway is
 * reachable, and revoking it again changes nothing.
 *
 * @extends Command<ShareSummary>
 */
#[Authorize(SharingPolicy::class, AccessType::Edit)]
#[RequiresRequestKey(retentionDays: 31, refusalDays: 365)]
final readonly class RevokeShareCommand extends Command
{
    public function __construct(
        public string $shareId,
        public string $requestKey,
    ) {}
}
