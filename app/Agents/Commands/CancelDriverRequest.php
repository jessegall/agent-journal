<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\CancelDriverRequestHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * A user cancels a driver request that has not started; cancelling a setting change puts the runtime's
 * requested settings back to what the requests still open ask for. The request's new row version is the answer.
 *
 * @extends Command<int>
 */
#[HandledBy(CancelDriverRequestHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Recover)]
#[Operation('cancel_driver_request', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class CancelDriverRequest extends Command implements AuthorizedCommand
{
    public function __construct(
        public string $requestId,
        public int $expectedRowVersion,
        public string $reason,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
