<?php

declare(strict_types=1);

namespace App\Commands\RequestShare;

use App\Attributes\Authorize;
use App\Attributes\RequiresRequestKey;
use App\Enums\AccessType;
use App\Policies\ShareRequestPolicy;
use App\Support\Command;
use App\Support\ShareProposalStatus;

/**
 * An agent proposes sharing a record it may read: the proposal waits seven days for the owner, holds no token and
 * opens no gateway, and the agent learns only its number and state.
 *
 * @extends Command<ShareProposalStatus>
 */
#[RequiresRequestKey(retentionDays: 31, refusalDays: 365)]
#[Authorize(ShareRequestPolicy::class, AccessType::Create)]
final readonly class RequestShareCommand extends Command
{
    public function __construct(
        public string $rootType,
        public string $rootId,
        public string $requestKey,
    ) {}
}
