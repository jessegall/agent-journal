<?php

declare(strict_types=1);

namespace App\Contracts\Hosts;

/**
 * Answers whether the image build verified a Docker image and recorded it by digest.
 */
interface DockerImageVerifier
{
    /**
     * Whether the image is one the journal built and signed, so it may run.
     */
    public function isVerified(string $imageReference): bool;
}
