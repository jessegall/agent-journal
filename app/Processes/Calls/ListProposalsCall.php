<?php

declare(strict_types=1);

namespace App\Processes\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Attributes\PresentList;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use Spatie\LaravelData\Data;

/**
 * Lists the current project's rule proposals in the states asked for, or in every state.
 *
 * @implements JournalCall<ProposalList>
 */
#[Endpoint('processes/proposals/list', 'POST', ProposalList::class, CallEffect::Read)]
final class ListProposalsCall extends Data implements JournalCall
{
    /**
     * @param  list<string>  $states
     */
    public function __construct(
        #[PresentList]
        public array $states = [],
    ) {}
}
