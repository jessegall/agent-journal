<?php

declare(strict_types=1);

namespace App\Commands\SendDriverRequestAgain;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;

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
