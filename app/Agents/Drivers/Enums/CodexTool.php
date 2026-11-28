<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Enums;

use App\Exceptions\UnsupportedHook;

/**
 * The Codex tools the adapter knows, by the names Codex 0.165.0 uses: running a shell command, writing to a background
 * terminal it keeps running, applying a patch, and finding or reading MCP tools and resources.
 */
enum CodexTool: string
{
    case Bash = 'Bash';
    case WriteStdin = 'write_stdin';
    case ApplyPatch = 'apply_patch';
    case ToolSearch = 'tool_search';
    case ListMcpResources = 'list_mcp_resources';
    case ListMcpResourceTemplates = 'list_mcp_resource_templates';
    case ReadMcpResource = 'read_mcp_resource';

    public static function named(string $toolName): self
    {
        return self::tryFrom($toolName) ?? throw UnsupportedHook::forTool('Codex', $toolName);
    }

    public function isShell(): bool
    {
        return match ($this) {
            self::Bash => true,
            self::WriteStdin, self::ApplyPatch, self::ToolSearch, self::ListMcpResources,
            self::ListMcpResourceTemplates, self::ReadMcpResource => false,
        };
    }

    /**
     * Whether the tool finds or reads MCP tools and resources, which the start limits to the journal's server.
     */
    public function discoversJournalTools(): bool
    {
        return match ($this) {
            self::ToolSearch, self::ListMcpResources, self::ListMcpResourceTemplates, self::ReadMcpResource => true,
            self::Bash, self::WriteStdin, self::ApplyPatch => false,
        };
    }

    /**
     * Whether the tool names an MCP server or resource address the journal must check.
     */
    public function canReadResources(): bool
    {
        return match ($this) {
            self::ListMcpResources, self::ListMcpResourceTemplates, self::ReadMcpResource => true,
            self::Bash, self::WriteStdin, self::ApplyPatch, self::ToolSearch => false,
        };
    }

    /**
     * Whether the tool drives a terminal Codex keeps running in its own background, which no process of the journal's
     * may be.
     */
    public function drivesBackgroundTerminal(): bool
    {
        return $this === self::WriteStdin;
    }
}
