<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\ProposalState;
use App\Processes\Models\RuleProposal;

/**
 * What a proposal command answers: the proposal and its current revision, its state, and the fields a draft still
 * needs before review.
 */
final readonly class ProposalReceipt
{
    /**
     * @param  list<string>  $missingFields
     */
    private function __construct(
        public string $proposalId,
        public int $revision,
        public ProposalState $state,
        public array $missingFields,
    ) {}

    public static function of(RuleProposal $proposal, ProposedRule $proposed): self
    {
        return new self($proposal->id, $proposal->current_revision, $proposal->state, $proposed->missingFields());
    }
}
