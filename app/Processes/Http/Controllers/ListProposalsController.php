<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers;

use App\Http\Requests\Processes\ProposalListRequest;
use App\Processes\Models\RuleProposal;
use App\Processes\Support\ProjectKey;
use Illuminate\Http\JsonResponse;

/**
 * Lists the project's proposals, newest first, in one state or all.
 */
final readonly class ListProposalsController
{
    public function __invoke(ProposalListRequest $request, ProjectKey $projects): JsonResponse
    {
        $states = array_map(fn ($state): string => $state->value, $request->states());
        $proposals = RuleProposal::query()
            ->ofProject($projects->current())
            ->whereIn('state', $states)
            ->readLimit(100)
            ->get();

        return new JsonResponse($proposals->map(fn (RuleProposal $proposal) => [
            'proposal_id' => $proposal->id,
            'program' => $proposal->program,
            'operation' => $proposal->operation,
            'state' => $proposal->state->value,
            'revision' => $proposal->current_revision,
            'author' => "{$proposal->author_type}:{$proposal->author_id}",
        ])->all());
    }
}
