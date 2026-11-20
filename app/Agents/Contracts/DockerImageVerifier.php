<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

/**
 * Answers whether the image build verified a Docker image and recorded it by digest.
 */
interface DockerImageVerifier
{
    public function isVerified(string $imageReference): bool;
}
