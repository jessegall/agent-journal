<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use App\Processes\Enums\ProposalState;
use LogicException;

/**
 * A rule proposal cannot take this change: its request id is bound to another payload, or it is already ended.
 */
final class RuleProposalRefused extends LogicException
{
    public static function requestReused(string $requestId): self
    {
        return new self("The request id {$requestId} already proposed another declaration; use a new request id.");
    }

    public static function ended(string $id, ProposalState $state): self
    {
        return new self("Proposal {$id} is {$state->value}, so it takes no new revision.");
    }
}
