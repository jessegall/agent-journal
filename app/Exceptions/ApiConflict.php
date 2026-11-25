<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * The call conflicts with a change made meanwhile: the journal answered conflict.
 */
final class ApiConflict extends ApiRefused
{
    public const string CODE = 'conflict';
}
