<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Releases;

use App\Agents\Support\PublishedReleases;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Serves the detached ed25519 signature over the current release's manifest, never cached.
 */
final readonly class CurrentSignatureController
{
    public function __invoke(PublishedReleases $releases): BinaryFileResponse
    {
        return new BinaryFileResponse($releases->currentSignature(), headers: [
            'Content-Type' => 'application/octet-stream',
            'Cache-Control' => 'no-store',
        ]);
    }
}
