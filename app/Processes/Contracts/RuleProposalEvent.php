<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Contracts\Events\Event;

/**
 * A change to a rule proposal: every event of it implements this, so a listener typed on it receives them all.
 */
interface RuleProposalEvent extends Event
{
    public string $proposalId { get; }
}
