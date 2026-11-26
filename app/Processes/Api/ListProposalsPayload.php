<?php

declare(strict_types=1);

namespace App\Processes\Api;

use App\Attributes\Api\Endpoint;
use App\Attributes\Api\PresentList;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use Spatie\LaravelData\Data;

/**
 * Lists the current project's rule proposals in the states asked for, or in every state.
 *
 * @implements ApiPayload<ProposalList>
 */
#[Endpoint('processes/proposals/list', 'POST', ProposalList::class, ApiEffect::Read)]
final class ListProposalsPayload extends Data implements ApiPayload
{
    /**
     * @param  list<string>  $states
     */
    public function __construct(
        #[PresentList]
        public array $states = [],
    ) {}
}
