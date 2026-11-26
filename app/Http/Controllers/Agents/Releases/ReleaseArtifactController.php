<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Releases;

use App\Connections\PublishedReleases;
use App\Connections\Values\ReleaseArtifact;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Serves one file of a release by its version, target and installed name. A release never changes once published,
 * so its files are the only answers a cache may keep, for a year.
 */
final readonly class ReleaseArtifactController
{
    private const int YEAR_SECONDS = 31_536_000;

    public function __invoke(
        PublishedReleases $releases,
        string $version,
        string $target,
        string $name,
    ): BinaryFileResponse {
        $artifact = new ReleaseArtifact($version, $target, $name);

        $response = new BinaryFileResponse($releases->artifact($artifact), headers: [
            'Content-Type' => 'application/octet-stream',
        ]);

        return $response->setPublic()->setMaxAge(self::YEAR_SECONDS)->setImmutable();
    }
}
