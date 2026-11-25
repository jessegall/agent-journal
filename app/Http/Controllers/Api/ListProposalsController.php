<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\ListProposalsPayload;
use App\Api\Processes\ProposalList;
use App\Enums\CommandRules\ProposalState;
use App\Models\CommandRules\RuleProposal;
use App\Support\ServedEnvironment;

/**
 * Lists the project's proposals in the asked state.
 */
final readonly class ListProposalsController
{
    public function __invoke(ListProposalsPayload $call, ServedEnvironment $projects): ProposalList
    {
        $states = $call->states === [] ? ProposalState::cases() : array_map(ProposalState::from(...), $call->states);

        $proposals = RuleProposal::query()
            ->ofProject($projects->current())
            ->withAnyState($states)
            ->limit(100)
            ->get();

        return ProposalList::from(['proposals' => $proposals->map(fn (RuleProposal $proposal) => [
            'proposal_id' => $proposal->id,
            'program' => $proposal->program,
            'operation' => $proposal->operation,
            'state' => $proposal->state->value,
            'revision' => $proposal->current_revision,
            'author' => "{$proposal->author_type}:{$proposal->author_id}",
        ])->all()]);
    }
}
