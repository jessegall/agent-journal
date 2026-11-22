<?php

declare(strict_types=1);

namespace App\Agents\Commands\SendDriverRequestAgain;

use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * A user sends an uncertain delivery again as a new request, having confirmed it may arrive twice; the original
 * keeps its uncertainty and the new request's id is the answer.
 *
 * @extends Command<string>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class SendDriverRequestAgainCommand extends Command
{
    public function __construct(
        public string $requestId,
        public bool $confirmsPossibleDuplicate,
        public string $reason,
    ) {}
}
