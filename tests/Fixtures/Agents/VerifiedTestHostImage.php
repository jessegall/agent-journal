<?php

declare(strict_types=1);

namespace Tests\Fixtures\Agents;

use App\Hosts\Contracts\DockerImageVerifier;
use Tests\Support\Hosts\TestHost;

/**
 * The image record of a test journal: the stand-in agent image the test host runs is the one verified image.
 */
final readonly class VerifiedTestHostImage implements DockerImageVerifier
{
    public function isVerified(string $imageReference): bool
    {
        return $imageReference === TestHost::IMAGE;
    }
}
