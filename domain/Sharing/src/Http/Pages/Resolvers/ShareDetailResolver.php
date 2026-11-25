<?php

declare(strict_types=1);

namespace Domain\Sharing\Http\Pages\Resolvers;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Navigation\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use Domain\Sharing\Data\ShareAuditData;
use Domain\Sharing\Data\ShareControlsPartData;
use Domain\Sharing\Data\ShareMemberData;
use Domain\Sharing\Exceptions\ShareUnavailable;
use Domain\Sharing\Http\Pages\SharesShow;
use Domain\Sharing\Http\Requests\ShareRequest;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareMember;
use Domain\Sharing\Support\ShareAuditResolver;
use Domain\Sharing\Support\ShareLinkResolver;

/**
 * One share for its owner: the controls it allows the viewer, and, only when their tab is chosen, the records shared
 * with it or one page of its audit from the window's cursor.
 */
final readonly class ShareDetailResolver implements PageResolver
{
    public function __construct(
        private ShareRequest $request,
        private CurrentActor $actors,
        private ShareLinkResolver $links,
        private ShareAuditResolver $audits,
        private SharesShow $page,
    ) {}

    public function read(): DeclaredLayoutData
    {
        $share = Share::findById($this->request->shareId())->getOrThrow(ShareUnavailable::for($this->request->shareId()));

        $controls = ShareControlsPartData::from([
            'id' => $share->id,
            'state' => $share->state,
            'mayReveal' => $this->links->linkFor($this->actors->actor(), $share->id)->isDefined(),
            'mayRetry' => $share->state->mayRetry() && $share->expires_at->isFuture(),
            'mayRevoke' => ! $share->state->isTerminal(),
        ]);

        return $this->page->of(
            $share,
            $controls,
            $this->request->chosenTab(),
            fn () => ShareAuditData::fromPage($this->audits->page($share, $this->request->auditAfter())),
            fn () => array_map(ShareMemberData::fromMember(...), ShareMember::findCurrentOf($share)),
        );
    }
}
