<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Programs;

/**
 * The Codex tools the adapter knows: running a shell command, and applying a patch to files.
 */
enum CodexTool: string
{
    case Shell = 'shell';
    case ExecCommand = 'exec_command';
    case ApplyPatch = 'apply_patch';

    public static function named(string $toolName): self
    {
        return self::tryFrom($toolName) ?? throw UnsupportedHook::forTool('Codex', $toolName);
    }

    public function isShell(): bool
    {
        return match ($this) {
            self::Shell, self::ExecCommand => true,
            self::ApplyPatch => false,
        };
    }
}
