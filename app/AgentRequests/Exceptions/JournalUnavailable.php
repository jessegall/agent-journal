<?php

declare(strict_types=1);

namespace App\AgentRequests\Exceptions;

/**
 * The journal cannot answer now: the journal answered unavailable.
 */
final class JournalUnavailable extends CallRefused
{
    public const string CODE = 'unavailable';
}
