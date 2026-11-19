<?php

declare(strict_types=1);

namespace App\Processes\Calls;

use Spatie\LaravelData\Data;

/**
 * The current project's rule proposals, in one state or all.
 */
final class ProposalList extends Data
{
    /**
     * @param  list<array{
     *     proposal_id: string,
     *     program: string,
     *     operation: string,
     *     state: string,
     *     revision: int,
     *     author: string,
     * }>  $proposals
     */
    public function __construct(
        public array $proposals,
    ) {}
}
