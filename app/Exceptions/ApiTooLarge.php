<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * The answer is larger than the call allows: the journal answered too_large.
 */
final class ApiTooLarge extends ApiRefused
{
    public const string CODE = 'too_large';
}
