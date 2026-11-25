<?php

declare(strict_types=1);

namespace App\Enums\Terminals;

/**
 * What a browser writer decides for the unsent line in the composer, as the host's input gate names it.
 */
enum TerminalDraftChoice: string
{
    case Send = 'send';
    case SaveAndClear = 'save-and-clear';
    case CancelPendingWork = 'cancel-pending-work';
}
