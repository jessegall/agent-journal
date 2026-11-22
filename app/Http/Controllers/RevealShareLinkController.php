<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Contracts\Actors\CurrentActor;
use App\Exceptions\ShareLinkRefused;
use App\Http\Requests\Sharing\ShareRequest;
use App\Http\Responses\PageActionAnswers;
use App\Support\ShareLinkResolver;
use Illuminate\Http\RedirectResponse;

/**
 * The owner's deliberate reveal of a share's public address, never kept in a page: the share window gets it as a
 * one-time flash beside the page it shows again.
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
        PageActionAnswers $answers,
    ): RedirectResponse {
        $url = $links->linkFor($actors->actor(), $request->shareId())->getOrThrow(ShareLinkRefused::unknown());

        return $answers->backWith(self::REVEALED_LINK, $url);
    }
}
