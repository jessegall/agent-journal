<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * The profiles cannot be read now: the journal answered profiles_unavailable.
 */
final class ProfilesUnavailable extends ApiRefused
{
    public const string CODE = 'profiles_unavailable';
}
