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
    public function __invoke(string $file, SharingAssets $assets, SharedPageResponses $responses): Response
    {
        if (! $assets->lists($file)) {
            return $responses->refused(404);
        }

        $type = str_ends_with($file, '.css') ? 'text/css' : 'application/octet-stream';

        return new BinaryFileResponse($assets->path($file), 200, ['Content-Type' => $type]);
    }
}
