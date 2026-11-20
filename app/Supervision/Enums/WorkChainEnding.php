<?php

declare(strict_types=1);

namespace App\Supervision\Enums;

/**
 * How the chain of reviewed work ended: merged, withdrawn by who asked for the work, or closed by the owner.
 */
enum WorkChainEnding: string
{
    case Merged = 'merged';
    case Withdrawn = 'withdrawn';
    case Closed = 'closed';
}
