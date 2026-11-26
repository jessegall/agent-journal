<?php

declare(strict_types=1);

namespace App\Sharing\Commands\ApproveShareRequest;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Bus\Attributes\Commands\RequiresRequestKey;
use App\Policies\SharingPolicy;
use App\Sharing\Support\ShareSummary;
use App\Support\Command;

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
