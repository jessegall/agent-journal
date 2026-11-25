<?php

declare(strict_types=1);

namespace App\Enums\Processes;

/**
 * Who keeps the answer of a keyed write for its request key: the command bus's receipt, or the operation's own repeat
 * check.
 */
enum ReceiptOwner: string
{
    case CommandBus = 'command_bus';
    case Operation = 'operation';
}
