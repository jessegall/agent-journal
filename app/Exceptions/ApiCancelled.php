<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * The call was cancelled: the journal answered cancelled.
 */
final class ApiCancelled extends ApiRefused
{
    public const string CODE = 'cancelled';
}
