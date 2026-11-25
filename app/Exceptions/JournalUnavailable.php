<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * The journal cannot answer now: the journal answered unavailable.
 */
final class JournalUnavailable extends ApiRefused
{
    public const string CODE = 'unavailable';
}
