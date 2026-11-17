<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Programs;

use App\Domain\Hooks\Inputs\FileOperation;

/**
 * The Claude Code tools the adapter knows, and what each one is to the journal.
 */
enum ClaudeCodeTool: string
{
    case Bash = 'Bash';
    case Edit = 'Edit';
    case MultiEdit = 'MultiEdit';
    case Write = 'Write';
    case NotebookEdit = 'NotebookEdit';
    case Read = 'Read';
    case Glob = 'Glob';
    case Grep = 'Grep';
    case LS = 'LS';
    case WebFetch = 'WebFetch';
    case WebSearch = 'WebSearch';
    case TodoWrite = 'TodoWrite';

    public static function named(string $toolName): self
    {
        return self::tryFrom($toolName) ?? throw UnsupportedHook::forTool('Claude Code', $toolName);
    }

    public function changesFiles(): bool
    {
        return match ($this) {
            self::Edit, self::MultiEdit, self::Write, self::NotebookEdit => true,
            self::Bash, self::Read, self::Glob, self::Grep, self::LS, self::WebFetch, self::WebSearch, self::TodoWrite => false,
        };
    }

    public function fileOperation(): FileOperation
    {
        return match ($this) {
            self::Write => FileOperation::Create,
            self::Edit, self::MultiEdit, self::NotebookEdit, self::Bash, self::Read, self::Glob, self::Grep, self::LS, self::WebFetch, self::WebSearch, self::TodoWrite => FileOperation::Edit,
        };
    }
}
