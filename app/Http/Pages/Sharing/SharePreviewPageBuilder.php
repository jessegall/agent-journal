<?php

declare(strict_types=1);

namespace App\Http\Pages\Sharing;

use App\Actors\Contracts\CurrentActor;
use App\Http\Requests\Sharing\SharePreviewPageRequest;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareMember;
use App\Models\Sharing\SharePreview;
use App\Reads\Contracts\ReadMeter;
use App\Reads\PageFormRequests;
use App\Records\Contracts\RecordResolver;
use App\Sharing\Data\RootShareData;
use App\Sharing\Data\SavedSharePreviewData;
use App\Sharing\Data\ShareCandidateData;
use App\Sharing\Data\SharePreviewData;
use App\Sharing\Support\ShareBudget;
use App\Sharing\Support\ShareLinkedCandidate;
use App\Sharing\Support\ShareScope;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;

/**
 * The owner's share preview page: the root's candidates found now, each marked shared when the root's live share
 * approves its link, and the owner's last open preview of the root.
 */
final readonly class SharePreviewPageBuilder implements PageBuilder
{
    public function __construct(
        private PageFormRequests $requests,
        private ShareScope $scope,
        private ReadMeter $meter,
        private CurrentActor $actors,
        private RecordResolver $records,
    ) {}

    public function build(Request $visit): SharePreviewData
    {
        $input = $this->requests->from(SharePreviewPageRequest::class, $visit);

        $root = $input->shareRoot($this->records);
        $candidates = $this->scope->discover($root, ShareBudget::forPreview($this->meter));

        $live = Share::findLiveFor($root);

        $approved = $live->map(
            fn (Share $share) => ShareMember::resolveApprovedLinkIdsOf($share),
        )->getOrElse([]);

        $saved = SharePreview::findOpenFor($this->actors->actor()->actorId(), $root);

        return SharePreviewData::build()
            ->rootReference($input->rootReference())
            ->rootTitle($candidates->root->title)
            ->candidates(
                array_map(
                    fn (ShareLinkedCandidate $candidate) => ShareCandidateData::fromCandidate($candidate, $approved),
                    $candidates->linked,
                ),
            )
            ->savedPreview(SavedSharePreviewData::optionalOrMissing($saved->getOrElse(null)))
            ->liveShare(RootShareData::optionalOrMissing($live->getOrElse(null)))
            ->openProposals(array_map(RootShareData::fromShare(...), Share::findOpenProposalsFor($root)))
            ->finish();
    }
}
