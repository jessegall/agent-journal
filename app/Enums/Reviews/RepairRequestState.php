<?php

declare(strict_types=1);

namespace App\Enums\Reviews;

/**
 * Where a request to repair reviewed work stands: waiting for its worker to be reopened, handed back to the worker,
 * or turned into a stuck ask because the work came back too often.
 */
enum RepairRequestState: string
{
    case Pending = 'pending';
    case Reopened = 'reopened';
    case Capped = 'capped';
}
