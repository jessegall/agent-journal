<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * Where one launch request stands: accepted, launched with a session, refused, or failed after acceptance.
 */
enum LaunchDisposition: string
{
    case Accepted = 'accepted';
    case Launched = 'launched';
    case Refused = 'refused';
    case Failed = 'failed';
}
