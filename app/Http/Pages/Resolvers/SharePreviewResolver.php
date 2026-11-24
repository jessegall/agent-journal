<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Navigation\PageResolver;
use App\Contracts\Reads\ReadMeter;
use App\Contracts\Records\RecordResolver;
use App\Data\Sharing\RootShareData;
use App\Data\Sharing\SavedSharePreviewData;
use App\Data\Sharing\ShareCandidateData;
use App\Data\Sharing\SharePreviewData;
use App\Http\Requests\Sharing\SharePreviewPageRequest;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareMember;
use App\Models\Sharing\SharePreview;
use App\Support\MeteredShareBudget;
use App\Support\ShareLinkedCandidate;
use App\Support\ShareScope;

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
        $candidates = $this->scope->discover($root, MeteredShareBudget::forPreview($this->meter));

        $live = Share::liveFor($root);

        $approved = $live->map(
            fn (Share $share) => ShareMember::approvedLinkIdsOf($share),
        )->getOrElse([]);

        $saved = SharePreview::openFor($this->actors->actor()->actorId(), $root);

        return SharePreviewData::from([
            'rootReference' => $this->request->rootReference(),
            'rootTitle' => $candidates->root->title,
            'candidates' => array_map(
                fn (ShareLinkedCandidate $candidate) => ShareCandidateData::fromCandidate($candidate, $approved),
                $candidates->linked,
            ),
            'savedPreview' => SavedSharePreviewData::optionalOrMissing($saved->getOrElse(null)),
            'liveShare' => RootShareData::optionalOrMissing($live->getOrElse(null)),
            'openProposals' => Share::openProposalsFor($root),
        ]);
    }
}
