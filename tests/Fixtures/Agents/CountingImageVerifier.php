<?php

declare(strict_types=1);

namespace Tests\Fixtures\Agents;

use App\Agents\Contracts\DockerImageVerifier;

/**
 * Verifies every image and counts how often it was asked, so a test sees whether an admission ran.
 */
final class CountingImageVerifier implements DockerImageVerifier
{
    public int $checks = 0;

    public function isVerified(string $imageReference): bool
    {
        $this->checks++;

        return true;
    }
}
