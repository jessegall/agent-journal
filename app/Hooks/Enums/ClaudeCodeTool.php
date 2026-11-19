<?php

declare(strict_types=1);

namespace App\Hooks\Enums;

use App\Hooks\Exceptions\UnsupportedHook;

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
    case ToolSearch = 'ToolSearch';
    case ListMcpResources = 'ListMcpResourcesTool';
    case ReadMcpResource = 'ReadMcpResourceTool';
    case ReadMcpResourceDirectory = 'ReadMcpResourceDirTool';

    public static function named(string $toolName): self
    {
        return self::tryFrom($toolName) ?? throw UnsupportedHook::forTool('Claude Code', $toolName);
    }

    public function changesFiles(): bool
    {
        return match ($this) {
            self::Edit, self::MultiEdit, self::Write, self::NotebookEdit => true,
            self::Bash, self::Read, self::Glob, self::Grep, self::LS, self::WebFetch, self::WebSearch,
            self::TodoWrite, self::ToolSearch, self::ListMcpResources, self::ReadMcpResource,
            self::ReadMcpResourceDirectory => false,
        };
    }

    /**
     * Whether the tool reads a file or a folder the agent names, which the file access policy then judges.
     */
    public function readsFiles(): bool
    {
        return match ($this) {
            self::Read, self::Glob, self::Grep, self::LS => true,
            self::Bash, self::Edit, self::MultiEdit, self::Write, self::NotebookEdit, self::WebFetch, self::WebSearch,
            self::TodoWrite, self::ToolSearch, self::ListMcpResources, self::ReadMcpResource,
            self::ReadMcpResourceDirectory => false,
        };
    }

    public function fileOperation(): FileOperation
    {
        return match ($this) {
            self::Write => FileOperation::Create,
            default => FileOperation::Edit,
        };
    }

    /**
     * Whether the tool finds or reads MCP tools and resources, which the start limits to the journal's server.
     */
    public function discoversJournalTools(): bool
    {
        return match ($this) {
            self::ToolSearch, self::ListMcpResources, self::ReadMcpResource, self::ReadMcpResourceDirectory => true,
            self::Bash, self::Edit, self::MultiEdit, self::Write, self::NotebookEdit, self::Read,
            self::Glob, self::Grep, self::LS, self::WebFetch, self::WebSearch, self::TodoWrite => false,
        };
    }

    /**
     * Whether the tool names an MCP server or resource address the journal must check.
     */
    public function canReadResources(): bool
    {
        return match ($this) {
            self::ListMcpResources, self::ReadMcpResource, self::ReadMcpResourceDirectory => true,
            self::Bash, self::Edit, self::MultiEdit, self::Write, self::NotebookEdit, self::Read,
            self::Glob, self::Grep, self::LS, self::WebFetch, self::WebSearch, self::TodoWrite,
            self::ToolSearch => false,
        };
    }
}
