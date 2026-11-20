<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Sharing\Enums\SharingAbility;
use App\Sharing\Handlers\ApproveShareRequestHandler;
use App\Sharing\Models\Share;
use App\Sharing\Policies\SharingPolicy;
use App\Sharing\Support\ShareSummary;

/**
 * The owner approves an agent's proposal from a fresh preview of the same record, for a number of minutes: the
 * proposal becomes the owner's grant, independent of the agent's session from then on.
 *
 * @extends Command<ShareSummary>
 */
#[HandledBy(ApproveShareRequestHandler::class)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
#[Authorize(SharingPolicy::class, SharingAbility::Administer)]
#[Operation('approve_share_request', ResourceAreaType::JournalControl, AccessType::Edit)]
final readonly class ApproveShareRequest extends Command implements AuthorizedCommand
{
    public function __construct(
        public string $shareId,
        public string $previewId,
        public string $previewChecksum,
        public int $minutesUntilExpiry,
        public string $requestKey,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Share::class;
    }
}
