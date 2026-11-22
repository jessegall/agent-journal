<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\StartDisposition;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * Hides one version of an agent's launch outcome from the viewer who dismisses it, and from nobody else; a newer
 * outcome of the same start, or a newer start, shows again.
 *
 * @extends Command<null>
 */
#[Authorize(AgentPolicy::class, AccessType::Read)]
final readonly class DismissLaunchOutcome extends Command
{
    public function __construct(
        public string $agentId,
        public string $requestId,
        public StartDisposition $version,
    ) {}
}
