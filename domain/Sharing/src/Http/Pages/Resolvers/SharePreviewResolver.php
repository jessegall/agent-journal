<?php

declare(strict_types=1);

namespace Domain\Sharing\Http\Pages\Resolvers;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Navigation\PageResolver;
use App\Contracts\Reads\ReadMeter;
use App\Contracts\Records\RecordResolver;
use Domain\Sharing\Data\RootShareData;
use Domain\Sharing\Data\SavedSharePreviewData;
use Domain\Sharing\Data\ShareCandidateData;
use Domain\Sharing\Data\SharePreviewData;
use Domain\Sharing\Http\Requests\SharePreviewPageRequest;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareMember;
use Domain\Sharing\Models\SharePreview;
use Domain\Sharing\Support\ShareBudget;
use Domain\Sharing\Support\ShareLinkedCandidate;
use Domain\Sharing\Support\ShareScope;

/**
 * The owner's share preview page: the root's candidates found now, each marked shared when the root's live share
 * approves its link, and the owner's last open preview of the root.
 */
final readonly class SharePreviewResolver implements PageResolver
{
    public function __construct(
        private SharePreviewPageRequest $request,
        private ShareScope $scope,
        private ReadMeter $meter,
        private CurrentActor $actors,
        private RecordResolver $records,
    ) {}

    public function read(): SharePreviewData
    {
        $root = $this->request->shareRoot($this->records);
        $candidates = $this->scope->discover($root, ShareBudget::forPreview($this->meter));

        $live = Share::findLiveFor($root);

        $approved = $live->map(
            fn (Share $share) => ShareMember::resolveApprovedLinkIdsOf($share),
        )->getOrElse([]);

        $saved = SharePreview::findOpenFor($this->actors->actor()->actorId(), $root);

        return SharePreviewData::from([
            'rootReference' => $this->request->rootReference(),
            'rootTitle' => $candidates->root->title,
            'candidates' => array_map(
                fn (ShareLinkedCandidate $candidate) => ShareCandidateData::fromCandidate($candidate, $approved),
                $candidates->linked,
            ),
            'savedPreview' => SavedSharePreviewData::optionalOrMissing($saved->getOrElse(null)),
            'liveShare' => RootShareData::optionalOrMissing($live->getOrElse(null)),
            'openProposals' => Share::findOpenProposalsFor($root),
        ]);
    }
}
