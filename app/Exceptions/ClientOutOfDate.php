<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * This client is older than the journal accepts: the journal answered unsupported_version.
 */
final class ClientOutOfDate extends ApiRefused
{
    public const string CODE = 'unsupported_version';
}
