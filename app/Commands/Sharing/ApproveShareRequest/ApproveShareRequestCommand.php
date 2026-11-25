<?php

declare(strict_types=1);

namespace App\Commands\Sharing\ApproveShareRequest;

use App\Attributes\Authorize;
use App\Attributes\RequiresRequestKey;
use App\Enums\Agents\AccessType;
use App\Policies\SharingPolicy;
use App\Support\Command;
use App\Support\ShareSummary;

/**
 * The owner approves an agent's proposal from a fresh preview of the same record, for a number of minutes: the
 * proposal becomes the owner's grant, independent of the agent's session from then on.
 *
 * @extends Command<ShareSummary>
 */
#[Authorize(SharingPolicy::class, AccessType::Edit)]
#[RequiresRequestKey(retentionDays: 31, refusalDays: 365)]
final readonly class ApproveShareRequestCommand extends Command
{
    public function __construct(
        public string $shareId,
        public string $previewId,
        public string $previewChecksum,
        public int $minutesUntilExpiry,
        public string $requestKey,
    ) {}
}
