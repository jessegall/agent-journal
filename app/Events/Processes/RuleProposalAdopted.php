<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Processes\RuleProposalEvent;

/**
 * A command rule proposal was adopted.
 */
final readonly class RuleProposalAdopted implements ProcessEvent, RuleProposalEvent
{
    public function __construct(
        public string $proposalId,
    ) {}
}
