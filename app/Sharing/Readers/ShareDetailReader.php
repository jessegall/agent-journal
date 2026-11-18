<?php

declare(strict_types=1);

namespace App\Sharing\Readers;

use App\Actors\Contracts\CurrentActor;
use App\Http\Data\Sharing\ShareAuditData;
use App\Http\Data\Sharing\ShareDetailData;
use App\Http\Requests\Sharing\ShareRequest;
use App\Sharing\Exceptions\ShareUnavailable;
use App\Sharing\Models\Share;
use App\Sharing\Support\ShareAuditReader;
use App\Sharing\Support\ShareLinkReader;
use App\Ui\Contracts\PageReader;

/**
 * One share for its owner: its state, root, gateway, deadline and current members, and whether it may be revealed,
 * retried or revoked now. Its address is left out; only the reveal action answers with it.
 */
final readonly class ShareDetailReader implements PageReader
{
    public function __construct(
        private ShareRequest $request,
        private CurrentActor $actors,
        private ShareLinkReader $links,
        private ShareAuditReader $audits,
    ) {}

    public function read(): ShareDetailData
    {
        $share = Share::byId($this->request->shareId())->getOrThrow(ShareUnavailable::for($this->request->shareId()));
        $mayReveal = $this->links->linkFor($this->actors->actor(), $share->id)->isDefined();
        $audit = ShareAuditData::fromPage($this->audits->page($share, $this->request->auditAfter()));

        return ShareDetailData::fromShare($share, $mayReveal, $audit);
    }
}
