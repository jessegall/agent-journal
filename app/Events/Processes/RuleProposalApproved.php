<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Processes\RuleProposalEvent;

/**
 * A rule proposal was approved.
 */
final readonly class RuleProposalApproved extends ProcessEvent implements RuleProposalEvent
{
    public function __construct(public string $proposalId) {}
}
