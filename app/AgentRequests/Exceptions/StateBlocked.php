<?php

declare(strict_types=1);

namespace App\AgentRequests\Exceptions;

/**
 * The record's state does not allow this call: the journal answered state_blocked.
 */
final class StateBlocked extends CallRefused
{
    public const string CODE = 'state_blocked';
}
