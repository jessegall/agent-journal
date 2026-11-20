<?php

declare(strict_types=1);

namespace App\Hooks\Enums;

/**
 * Whether a state's frame carries into the session that continues an agent's work: durable work it still owes does,
 * a state that belongs to one session does not.
 */
enum SessionTransferType: string
{
    case Durable = 'durable';
    case SessionOnly = 'session_only';
}
