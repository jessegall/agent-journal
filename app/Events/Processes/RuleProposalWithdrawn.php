<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Processes\Contracts\RuleProposalEvent;

/**
 * A command rule proposal was withdrawn by its author.
 */
final readonly class RuleProposalWithdrawn implements ProcessEvent, RuleProposalEvent
{
    public function __construct(
        public string $proposalId,
    ) {}
}
