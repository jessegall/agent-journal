<?php

declare(strict_types=1);

namespace App\Contracts\Sessions;

use App\Support\RankedStartCandidate;
use App\Support\StartCandidateQuery;

/**
 * Ranks the helpers an owner offers for a new start: only agents that pin the profile key, are not retired and have
 * no running, silent or unresolved start, best first; the list is advisory and a start checks again under its lock.
 */
interface SessionStartCandidates
{
    /**
     * @return list<RankedStartCandidate>
     */
    public function rank(StartCandidateQuery $query): array;
}
