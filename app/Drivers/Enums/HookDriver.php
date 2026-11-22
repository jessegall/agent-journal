<?php

declare(strict_types=1);

namespace App\Drivers\Enums;

/**
 * The agent drivers whose hooks the journal answers, as they appear in the hook endpoint's address.
 */
enum HookDriver: string
{
    case ClaudeCode = 'claude-code';
    case Codex = 'codex';
}
