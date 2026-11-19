<?php

declare(strict_types=1);

namespace App\Sharing\Http\Controllers;

use App\Actors\Contracts\CurrentActor;
use App\Http\Data\Sharing\ShareLinkData;
use App\Http\Requests\Sharing\ShareRequest;
use App\Sharing\Exceptions\ShareLinkRefused;
use App\Sharing\Support\ShareLinkResolver;
use Illuminate\Http\JsonResponse;

/**
 * The owner's deliberate reveal of a share's public address: answered in this response alone, never kept in a page.
 */
final readonly class RevealShareLinkController
{
    public function __invoke(ShareRequest $request, CurrentActor $actors, ShareLinkResolver $links): JsonResponse
    {
        $url = $links->linkFor($actors->actor(), $request->shareId())->getOrThrow(ShareLinkRefused::unknown());

        return new JsonResponse(new ShareLinkData($url));
    }
}
