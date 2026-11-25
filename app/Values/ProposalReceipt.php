<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\CommandRules\ProposalState;
use App\Models\CommandRules\RuleProposal;

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

    /**
     * @return array{proposal_id: string, revision: int, state: string, missing_fields: list<string>}
     */
    public function toArray(): array
    {
        return [
            'proposal_id' => $this->proposalId,
            'revision' => $this->revision,
            'state' => $this->state->value,
            'missing_fields' => $this->missingFields,
        ];
    }

    public static function of(RuleProposal $proposal, ProposedRule $proposed): self
    {
        return new self($proposal->id, $proposal->current_revision, $proposal->state, $proposed->missingFields());
    }
}
