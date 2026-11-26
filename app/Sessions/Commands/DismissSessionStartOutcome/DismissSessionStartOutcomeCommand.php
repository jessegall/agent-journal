<?php

declare(strict_types=1);

namespace App\Sessions\Commands\DismissSessionStartOutcome;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\AgentPolicy;
use App\Sessions\Enums\StartDisposition;
use App\Support\Command;

/**
 * Hides one version of an agent's start outcome from the viewer who dismisses it, and from nobody else; a newer
 * outcome of the same start, or a newer start, shows again.
 *
 * @extends Command<null>
 */
#[Authorize(AgentPolicy::class, AccessType::Read)]
final readonly class DismissSessionStartOutcomeCommand extends Command
{
    public function __construct(
        public string $agentId,
        public string $requestId,
        public StartDisposition $version,
    ) {}
}
