<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Contracts\Command;
use App\Sharing\Handlers\RequestShareHandler;
use App\Sharing\Support\ShareProposalStatus;

/**
 * An agent proposes sharing a record it may read: the proposal waits seven days for the owner, holds no token and
 * opens no gateway, and the agent learns only its number and state.
 *
 * @implements Command<ShareProposalStatus>
 */
#[HandledBy(RequestShareHandler::class)]
#[RequiresActor(ActorType::Agent)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
final readonly class RequestShare implements Command
{
    public function __construct(
        public string $rootType,
        public string $rootId,
        public string $requestKey,
    ) {}
}
