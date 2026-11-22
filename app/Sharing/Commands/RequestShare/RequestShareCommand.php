<?php

declare(strict_types=1);

namespace App\Sharing\Commands\RequestShare;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Sharing\Policies\ShareRequestPolicy;
use App\Sharing\Support\ShareProposalStatus;

/**
 * An agent proposes sharing a record it may read: the proposal waits seven days for the owner, holds no token and
 * opens no gateway, and the agent learns only its number and state.
 *
 * @extends Command<ShareProposalStatus>
 */
#[Authorize(ShareRequestPolicy::class, AccessType::Create)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
final readonly class RequestShareCommand extends Command
{
    public function __construct(
        public string $rootType,
        public string $rootId,
        public string $requestKey,
    ) {}
}
