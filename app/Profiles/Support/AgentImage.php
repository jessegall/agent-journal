<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Values\ProfileStartPolicy;

/**
 * The image a session's container runs: the agent image AGENT_IMAGE names by its digest on a server, the local helper
 * image otherwise. The one place that names it.
 */
final readonly class AgentImage
{
    private function __construct(public string $reference) {}

    public static function fromConfig(string $configured): self
    {
        return new self($configured === '' ? ProfileStartPolicy::HELPER_IMAGE : $configured);
    }
}
