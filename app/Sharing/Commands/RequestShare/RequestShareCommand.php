<?php

declare(strict_types=1);

namespace App\Sharing\Commands\RequestShare;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Bus\Attributes\Commands\RequiresRequestKey;
use App\Policies\ShareRequestPolicy;
use App\Sharing\Support\ShareProposalStatus;
use App\Support\Command;

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
