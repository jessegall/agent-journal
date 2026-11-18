<?php

declare(strict_types=1);

namespace App\Sharing\Readers;

use App\Actors\Contracts\CurrentActor;
use App\Http\Data\Sharing\RootShareData;
use App\Http\Data\Sharing\SavedSharePreviewData;
use App\Http\Data\Sharing\ShareCandidateData;
use App\Http\Data\Sharing\SharePreviewData;
use App\Http\Requests\Sharing\SharePreviewPageRequest;
use App\Reads\Contracts\ReadMeter;
use App\Records\Contracts\RecordReader;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareMember;
use App\Sharing\Models\SharePreview;
use App\Sharing\Support\MeteredShareBudget;
use App\Sharing\Support\ShareLinkedCandidate;
use App\Sharing\Support\ShareScope;
use App\Ui\Contracts\PageReader;
use Spatie\LaravelData\Optional;

/**
 * The owner's share preview page: the root's candidates found now, each marked shared when the root's live share
 * approves its link, and the owner's last open preview of the root.
 */
final readonly class SharePreviewReader implements PageReader
{
    public function __construct(
        private SharePreviewPageRequest $request,
        private ShareScope $scope,
        private ReadMeter $meter,
        private CurrentActor $actors,
        private RecordReader $records,
    ) {}

    public function read(): SharePreviewData
    {
        $root = $this->request->shareRoot($this->records);
        $candidates = $this->scope->discover($root, MeteredShareBudget::forPreview($this->meter));
        $approved = Share::liveFor($root)->map(fn (Share $share) => ShareMember::approvedLinkIdsOf($share))->getOrElse([]);
        $saved = SharePreview::openFor($this->actors->actor()->actorId(), $root);

        return SharePreviewData::from([
            'rootReference' => $this->request->rootReference(),
            'rootTitle' => $candidates->root->title,
            'candidates' => array_map(
                fn (ShareLinkedCandidate $candidate) => ShareCandidateData::fromCandidate($candidate, $approved),
                $candidates->linked,
            ),
            'savedPreview' => $saved->map(SavedSharePreviewData::fromPreview(...))->getOrElse(Optional::create()),
            'liveShare' => Share::liveFor($root)->map(RootShareData::fromShare(...))->getOrElse(Optional::create()),
            'openProposals' => array_map(RootShareData::fromShare(...), Share::openProposalsFor($root)),
        ]);
    }
}
