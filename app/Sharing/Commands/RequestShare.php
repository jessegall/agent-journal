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
use App\Sharing\Handlers\RequestShareHandler;
use App\Sharing\Models\Share;
use App\Sharing\Policies\SharingPolicy;
use App\Sharing\Support\ShareProposalStatus;

/**
 * An agent proposes sharing a record it may read: the proposal waits seven days for the owner, holds no token and
 * opens no gateway, and the agent learns only its number and state.
 *
 * @extends Command<ShareProposalStatus>
 */
#[HandledBy(RequestShareHandler::class)]
#[Authorize(SharingPolicy::class, SharingAbility::Request)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
#[Operation('request_share', ResourceAreaType::JournalControl, AccessType::Edit)]
final readonly class RequestShare extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $rootType,
        public string $rootId,
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
