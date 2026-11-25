<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

use App\Support\RecordIdentity;
use App\Support\ShareRecordCard;
use Domain\Sharing\Exceptions\SharePreviewRefused;

/**
 * What the owner may choose from before sharing: the root's card and the linked records that may be published with
 * it, each disclosable now.
 */
final readonly class ShareCandidates
{
    /**
     * @param  list<ShareLinkedCandidate>  $linked
     */
    public function __construct(
        public ShareRecordCard $root,
        public array $linked,
    ) {}

    /**
     * The linked candidates with these record ids, as selected targets; an id that is no current candidate is left out.
     *
     * @param  list<string>  $recordIds
     * @return list<ShareSelectedTarget>
     */
    public function selection(array $recordIds): array
    {
        $chosen = array_filter($this->linked, fn (ShareLinkedCandidate $candidate) => $candidate->isAmong($recordIds));

        return array_values(array_map(fn (ShareLinkedCandidate $candidate) => $candidate->toSelectedTarget(), $chosen));
    }

    /**
     * The linked candidates whose link the share does not approve yet, for the owner to see as not shared yet.
     *
     * @param  list<string>  $approvedLinkIds
     * @return list<ShareLinkedCandidate>
     */
    public function notSharedYet(array $approvedLinkIds): array
    {
        return array_values(array_filter(
            $this->linked,
            fn (ShareLinkedCandidate $candidate) => ! $candidate->isApprovedAmong($approvedLinkIds),
        ));
    }

    /**
     * The record the selected target is linked from, among these candidates.
     *
     * @throws SharePreviewRefused
     */
    public function sourceOf(ShareSelectedTarget $target): RecordIdentity
    {
        foreach ($this->linked as $candidate) {
            if ($candidate->linkId === $target->linkId) {
                return $candidate->source;
            }
        }

        throw SharePreviewRefused::targetGone($target->linkId);
    }
}
