<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Releases;

use App\Connections\PublishedReleases;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Serves the signed manifest of the current release as its exact bytes, never cached: the current release changes.
 */
final readonly class CurrentManifestController
{
    public function __invoke(PublishedReleases $releases): BinaryFileResponse
    {
        return new BinaryFileResponse($releases->currentManifest(), headers: [
            'Content-Type' => 'application/json',
            'Cache-Control' => 'no-store',
        ]);
    }
}
