<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * The journal cannot say whether the write took effect: the journal answered outcome_unknown.
 */
final class OutcomeUnknown extends ApiRefused
{
    public const string CODE = 'outcome_unknown';
}
