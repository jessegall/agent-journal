<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Processes\Contracts\RuleProposalEvent;

/**
 * A rule proposal was rejected.
 */
final readonly class RuleProposalRejected implements ProcessEvent, RuleProposalEvent
{
    public function __construct(public string $proposalId) {}
}
