<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Programs;

/**
 * The agent programs whose hooks the journal answers, as they appear in the hook endpoint's address.
 */
enum HookProgram: string
{
    case ClaudeCode = 'claude-code';
    case Codex = 'codex';
}
