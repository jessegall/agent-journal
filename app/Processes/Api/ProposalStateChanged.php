<?php

declare(strict_types=1);

namespace App\Processes\Api;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * The proposal a review moved and the state it is in now.
 */
final class ProposalStateChanged extends Data
{
    public function __construct(
        #[MapName('proposal_id')]
        public string $proposalId,
        public string $state,
    ) {}
}
