<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Sharing\Enums\SharingAbility;
use App\Sharing\Handlers\RevokeShareHandler;
use App\Sharing\Models\Share;
use App\Sharing\Policies\SharingPolicy;
use App\Sharing\Support\ShareSummary;

/**
 * The owner revokes a share or dismisses a proposal: it ends at once in the database, whether or not its gateway is
 * reachable, and revoking it again changes nothing.
 *
 * @extends Command<ShareSummary>
 */
#[HandledBy(RevokeShareHandler::class)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
#[Authorize(SharingPolicy::class, SharingAbility::Administer)]
#[Operation('revoke_share', ResourceAreaType::JournalControl, AccessType::Edit)]
final readonly class RevokeShare extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $shareId,
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
