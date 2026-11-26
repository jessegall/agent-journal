<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\CommandRules\Enums\ProposalStatus;
use App\Models\CommandRules\RuleProposal;
use App\Processes\Api\ListProposalsPayload;
use App\Processes\Api\ProposalList;

/**
 * Lists the project's proposals in the asked state.
 */
final readonly class ListProposalsController
{
    public function __invoke(ListProposalsPayload $call): ProposalList
    {
        $states = $call->states === [] ? ProposalStatus::cases() : array_map(ProposalStatus::from(...), $call->states);

        $proposals = RuleProposal::query()
            ->withAnyState($states)
            ->limit(100)
            ->get();

        return ProposalList::from(['proposals' => $proposals->map(fn (RuleProposal $proposal) => [
            'proposal_id' => $proposal->id,
            'program' => $proposal->program,
            'operation' => $proposal->operation,
            'state' => $proposal->status->value,
            'revision' => $proposal->current_revision,
            'author' => "{$proposal->author_type}:{$proposal->author_id}",
        ])->all()]);
    }
}
