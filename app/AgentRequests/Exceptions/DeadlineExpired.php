<?php

declare(strict_types=1);

namespace App\AgentRequests\Exceptions;

/**
 * The call reached the journal after its deadline: the journal answered deadline_expired.
 */
final class DeadlineExpired extends CallRefused
{
    public const string CODE = 'deadline_expired';
}
