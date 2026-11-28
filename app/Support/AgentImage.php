<?php

declare(strict_types=1);

namespace App\Support;

use App\Values\ProfileStartPolicy;

/**
 * The image a session's container runs: the agent image AGENT_IMAGE names by its digest on a server, the local helper
 * image otherwise. The one place that names it.
 */
final readonly class AgentImage
{
    private function __construct(public string $reference) {}

    /**
     * The repository the agent images loader names the agent image under in the agent daemon, tagged with its id.
     */
    private const string BUILD_BASE_REPOSITORY = 'journal-agent-base';

    public static function fromConfig(string $configured): self
    {
        return new self($configured === '' ? ProfileStartPolicy::HELPER_IMAGE : $configured);
    }

    /**
     * The name a driver image's build takes the agent image by: a build names its base by name, never by a bare id,
     * so the loader holds the image under one made of its own id.
     */
    public function buildBase(): string
    {
        return self::BUILD_BASE_REPOSITORY.':'.str_replace('sha256:', '', $this->reference);
    }
}
