<?php

declare(strict_types=1);

namespace App\AgentRequests\Exceptions;

/**
 * The journal cannot say whether the write took effect: the journal answered outcome_unknown.
 */
final class OutcomeUnknown extends CallRefused
{
    public const string CODE = 'outcome_unknown';
}
