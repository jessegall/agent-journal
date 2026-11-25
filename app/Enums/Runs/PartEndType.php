<?php

declare(strict_types=1);

namespace App\Enums\Runs;

/**
 * How a part's process ended: not yet, exited with a status code, killed by a signal, or with no end known.
 */
enum PartEndType: string
{
    case NotYet = 'not_yet';
    case Exited = 'exited';
    case Signalled = 'signalled';
    case Unavailable = 'unavailable';
}
