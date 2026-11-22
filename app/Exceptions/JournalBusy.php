<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * The journal is busy: the journal answered busy.
 */
final class JournalBusy extends CallRefused
{
    public const string CODE = 'busy';
}
