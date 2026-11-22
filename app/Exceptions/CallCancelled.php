<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * The call was cancelled: the journal answered cancelled.
 */
final class CallCancelled extends CallRefused
{
    public const string CODE = 'cancelled';
}
