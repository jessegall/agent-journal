<?php

declare(strict_types=1);

namespace App\Http\Controllers\Sharing;

use App\Http\Responses\Sharing\SharedPageResponses;
use App\Http\Responses\Sharing\SharingAssets;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Serves a file of the public reader's build when its manifest lists it; any other path is not available.
 */
final readonly class SharingAssetController
{
    public function __invoke(string $file, SharingAssets $assets): Response
    {
        if (! $assets->lists($file)) {
            return SharedPageResponses::refused(404);
        }

        return new BinaryFileResponse($assets->path($file), 200, ['Content-Type' => str_ends_with($file, '.css') ? 'text/css' : 'application/octet-stream']);
    }
}
