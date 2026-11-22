<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\CurrentActor;
use App\Data\Sharing\ShareLinkData;
use App\Exceptions\ShareLinkRefused;
use App\Http\Requests\Sharing\ShareRequest;
use App\Support\ShareLinkResolver;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;
use Inertia\ResponseFactory;

/**
 * The owner's deliberate reveal of a share's public address, never kept in a page: the share window gets it as a
 * one-time flash beside the page it shows again, a JSON caller in this response alone.
 */
final readonly class RevealShareLinkController
{
    /**
     * The flash key the share window reads the revealed address from.
     */
    public const string REVEALED_LINK = 'revealedLink';

    public function __invoke(
        ShareRequest $request,
        CurrentActor $actors,
        ShareLinkResolver $links,
        ResponseFactory $inertia,
        Redirector $redirect,
    ): JsonResponse|RedirectResponse {
        $url = $links->linkFor($actors->actor(), $request->shareId())->getOrThrow(ShareLinkRefused::unknown());

        if (! $request->expectsJson()) {
            $inertia->flash(self::REVEALED_LINK, $url);

            return $redirect->back(303);
        }

        return new JsonResponse(new ShareLinkData($url));
    }
}
