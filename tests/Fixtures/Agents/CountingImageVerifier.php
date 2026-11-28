<?php

declare(strict_types=1);

namespace Tests\Fixtures\Agents;

use App\Hosts\Contracts\DockerImageVerifier;

/**
 * Verifies every image and counts how often it was asked, so a test sees whether an admission ran.
 */
final class CountingImageVerifier implements DockerImageVerifier
{
    public int $checks = 0;

    private bool $isVerifying = true;

    /**
     * Every image checked from now on is refused, as a start whose agent image is not proven.
     */
    public function refuseEvery(): void
    {
        $this->isVerifying = false;
    }

    /**
     * Every image checked from now on is verified again.
     */
    public function verifyEvery(): void
    {
        $this->isVerifying = true;
    }

    public function isVerified(string $imageReference): bool
    {
        $this->checks++;

        return $this->isVerifying;
    }
}
