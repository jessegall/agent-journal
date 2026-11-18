<?php

declare(strict_types=1);

namespace App\Sharing\Support;

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
}
