<?php

declare(strict_types=1);

namespace App\Api\Processes;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * A rule proposal as it stands after a write: its revision, its state and what it still lacks.
 */
final class ProposalReceived extends Data
{
    /**
     * @param  list<string>  $missingFields
     */
    public function __construct(
        #[MapName('proposal_id')]
        public readonly string $proposalId,
        public readonly int $revision,
        public readonly string $state,
        #[MapName('missing_fields')]
        public readonly array $missingFields,
    ) {}
}
