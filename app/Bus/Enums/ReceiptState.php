<?php

declare(strict_types=1);

namespace App\Bus\Enums;

/**
 * Where a receipted write stands: its key taken by a running command, its result stored, or its refusal stored.
 */
enum ReceiptState: string
{
    case Taken = 'taken';
    case Completed = 'completed';
    case Refused = 'refused';
}
