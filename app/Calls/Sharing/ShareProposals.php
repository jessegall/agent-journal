<?php

declare(strict_types=1);

namespace App\Calls\Sharing;

use App\Data\Sharing\ShareProposalStatusData;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * The current actor's share proposals and what became of them.
 */
final class ShareProposals extends Data
{
    /**
     * @param  list<ShareProposalStatusData>  $proposals
     */
    public function __construct(
        #[DataCollectionOf(ShareProposalStatusData::class)]
        public array $proposals,
    ) {}
}
