<?php

declare(strict_types=1);

namespace App\Calls\Processes;

use App\Attributes\Endpoint;
use App\Attributes\PresentList;
use App\Contracts\JournalCall;
use App\Enums\CallEffect;
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
