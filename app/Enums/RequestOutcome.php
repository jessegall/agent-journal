<?php

declare(strict_types=1);

namespace App\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Why a driver request ended the way it did, beside its progress.
 */
#[TypeScript]
enum RequestOutcome: string
{
    case NoWork = 'no_work';
    case AlreadyIdle = 'already_idle';
    case TerminalRequired = 'terminal_required';
    case EntryUnavailable = 'entry_unavailable';
    case StopUnconfirmed = 'stop_unconfirmed';
    case ScriptFailed = 'script_failed';
    case Unconfirmed = 'unconfirmed';
    case Refused = 'refused';
}
