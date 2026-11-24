<?php

declare(strict_types=1);

namespace App\Commands\Sharing\RevokeShare;

use App\Attributes\Authorize;
use App\Attributes\RequiresRequestKey;
use App\Enums\AccessType;
use App\Policies\SharingPolicy;
use App\Support\Command;
use App\Support\ShareSummary;

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
