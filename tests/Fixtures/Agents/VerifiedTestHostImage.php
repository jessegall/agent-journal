<?php

declare(strict_types=1);

namespace Tests\Fixtures\Agents;

use App\Hosts\Contracts\DockerImageVerifier;
use Illuminate\Contracts\Config\Repository;
use Tests\Support\Hosts\TestHost;

/**
 * The image record of a test journal: the mock agent image the test host runs is the one verified image.
 */
final readonly class VerifiedTestHostImage implements DockerImageVerifier
{
    public function __construct(private Repository $config) {}

    /**
     * The agent image the journal is set to run is the verified one: the test host's own, or a played scenario's.
     */
    public function isVerified(string $imageReference): bool
    {
        return $imageReference === $this->config->string('journal.agents.agent_image', TestHost::IMAGE);
    }
}
