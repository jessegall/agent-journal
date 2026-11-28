<?php

declare(strict_types=1);

namespace App\Http\Pages\Sharing;

use App\Actors\Contracts\CurrentActor;
use App\Http\Pages\Sharing\SharesShow;
use App\Http\Requests\Sharing\ShareRequest;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareMember;
use App\Reads\PageFormRequests;
use App\Sharing\Data\ShareAuditData;
use App\Sharing\Data\ShareControlsPartData;
use App\Sharing\Data\ShareMemberData;
use App\Sharing\Exceptions\ShareUnavailable;
use App\Sharing\Support\ShareAuditResolver;
use App\Sharing\Support\ShareLinkResolver;
use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;

/**
 * One share for its owner: the controls it allows the viewer, and, only when their tab is chosen, the records shared
 * with it or one page of its audit from the window's cursor.
 */
final readonly class ShareDetailPageBuilder implements PageBuilder
{
    public function __construct(
        private PageFormRequests $requests,
        private CurrentActor $actors,
        private ShareLinkResolver $links,
        private ShareAuditResolver $audits,
        private SharesShow $page,
    ) {}

    public function build(Request $visit): ShareDetailPageData
    {
        return ShareDetailPageData::build()->shown($this->content($visit))->finish();
    }

    private function content(Request $visit): DeclaredLayoutData
    {
        $input = $this->requests->from(ShareRequest::class, $visit);

        $shareId = $input->shareId();
        $share = Share::findById($shareId)->getOrThrow(ShareUnavailable::for($shareId));

        $controls = ShareControlsPartData::from([
            'id' => $share->id,
            'status' => $share->status,
            'mayReveal' => $this->links->linkFor($this->actors->actor(), $share->id)->isDefined(),
            'mayRetry' => $share->status->mayRetry() && $share->expires_at->isFuture(),
            'mayRevoke' => ! $share->status->isTerminal(),
        ]);

        return $this->page->of(
            $share,
            $controls,
            $input->chosenTab(),
            fn () => ShareAuditData::fromPage($this->audits->page($share, $input->auditAfter())),
            fn () => array_map(ShareMemberData::fromMember(...), ShareMember::findCurrentOf($share)),
        );
    }
}
