<?php

declare(strict_types=1);

namespace App\AgentRequests\Exceptions;

/**
 * The journal did not accept the launch credential: the journal answered unauthenticated.
 */
final class NotAuthenticated extends CallRefused
{
    public const string CODE = 'unauthenticated';
}
