<?php

declare(strict_types=1);

namespace App\Api\Exceptions;

use App\Exceptions\ApiRefused;

/**
 * The journal is busy: the journal answered busy.
 */
final class JournalBusy extends ApiRefused
{
    public const string CODE = 'busy';
}
