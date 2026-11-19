<?php

declare(strict_types=1);

namespace App\AgentRequests\Exceptions;

/**
 * The profiles cannot be read now: the journal answered profiles_unavailable.
 */
final class ProfilesUnavailable extends CallRefused
{
    public const string CODE = 'profiles_unavailable';
}
