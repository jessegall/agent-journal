<?php

declare(strict_types=1);

namespace App\Enums\Sessions;

/**
 * Where one start request stands: accepted, started with a session, refused, or failed after acceptance.
 */
enum StartDisposition: string
{
    case Accepted = 'accepted';
    case Started = 'started';
    case Refused = 'refused';
    case Failed = 'failed';
}
