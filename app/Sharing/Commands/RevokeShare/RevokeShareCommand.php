<?php

declare(strict_types=1);

namespace App\Sharing\Commands\RevokeShare;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Bus\Attributes\Commands\RequiresRequestKey;
use App\Policies\SharingPolicy;
use App\Sharing\Support\ShareSummary;
use App\Support\Command;

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
