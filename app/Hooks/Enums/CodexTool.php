<?php

declare(strict_types=1);

namespace App\Hooks\Enums;

use App\Hooks\Exceptions\UnsupportedHook;

/**
 * The Codex tools the adapter knows, by the names Codex 0.165.0 sends: running a shell command, and applying a patch.
 */
enum CodexTool: string
{
    case Bash = 'Bash';
    case ApplyPatch = 'apply_patch';

    public static function named(string $toolName): self
    {
        return self::tryFrom($toolName) ?? throw UnsupportedHook::forTool('Codex', $toolName);
    }

    public function isShell(): bool
    {
        return match ($this) {
            self::Bash => true,
            self::ApplyPatch => false,
        };
    }
}
