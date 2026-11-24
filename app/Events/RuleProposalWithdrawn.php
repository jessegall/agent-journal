<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Processes\RuleProposalEvent;

/**
 * A command rule proposal was withdrawn by its author.
 */
final readonly class RuleProposalWithdrawn extends ProcessEvent implements RuleProposalEvent
{
    public function __construct(
        public string $proposalId,
    ) {}
}
