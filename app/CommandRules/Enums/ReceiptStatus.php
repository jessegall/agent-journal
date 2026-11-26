<?php

declare(strict_types=1);

namespace App\CommandRules\Enums;

/**
 * Where a receipted write stands: its key taken by a running command, its result stored, its refusal stored, or
 * past its retention with only its key kept, so the key is refused.
 */
enum ReceiptStatus: string
{
    case Taken = 'taken';
    case Completed = 'completed';
    case Refused = 'refused';
    case Expired = 'expired';
}
