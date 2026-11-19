<?php

declare(strict_types=1);

namespace App\Sharing\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Http\Data\Sharing\ShareAuditData;
use App\Http\Data\Sharing\ShareDetailData;
use App\Http\Requests\Sharing\ShareRequest;
use App\Sharing\Exceptions\ShareUnavailable;
use App\Sharing\Models\Share;
use App\Sharing\Support\ShareAuditResolver;
use App\Sharing\Support\ShareLinkResolver;
use App\Ui\Contracts\PageResolver;

/**
 * One share for its owner: its state, root, gateway, deadline and current members, and whether it may be revealed,
 * retried or revoked now. Its address is left out; only the reveal action answers with it.
 */
final readonly class ShareDetailResolver implements PageResolver
{
    public function __construct(
        private ShareRequest $request,
        private CurrentActor $actors,
        private ShareLinkResolver $links,
        private ShareAuditResolver $audits,
    ) {}

    public function read(): ShareDetailData
    {
        $share = Share::byId($this->request->shareId())->getOrThrow(ShareUnavailable::for($this->request->shareId()));
        $mayReveal = $this->links->linkFor($this->actors->actor(), $share->id)->isDefined();
        $audit = ShareAuditData::fromPage($this->audits->page($share, $this->request->auditAfter()));

        return ShareDetailData::fromShare($share, $mayReveal, $audit);
    }
}
