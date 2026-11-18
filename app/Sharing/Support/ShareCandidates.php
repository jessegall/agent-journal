<?php

declare(strict_types=1);

namespace App\Sharing\Support;

/**
 * What the owner may choose from before sharing: the root and the linked records that may be published with it.
 */
final readonly class ShareCandidates
{
    /**
     * @param  list<ShareRecordCard>  $linked
     */
    public function __construct(
        public ShareRecordCard $root,
        public array $linked,
    ) {}
}
