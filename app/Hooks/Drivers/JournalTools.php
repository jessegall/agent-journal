<?php

declare(strict_types=1);

namespace App\Hooks\Drivers;

use App\Hooks\Contracts\JournalToolNames;
use App\Hooks\Exceptions\UnsupportedHook;
use App\Hooks\Drivers\HookPayload;

/**
 * Recognizes a program's calls to the journal's own MCP server: a tool named mcp__journal__<name> for exactly a name
 * the journal offers, and a resource read that names the journal server and a journal://v1 address. Any other server
 * or address is refused; an mcp__ prefix alone is never trusted.
 */
final readonly class JournalTools
{
    private const string TOOL_PREFIX = 'mcp__journal__';

    private const string SERVER = 'journal';

    private const string RESOURCE_SCHEME = 'journal://v1/';

    public function __construct(private JournalToolNames $names) {}

    public function names(string $toolName): bool
    {
        return str_starts_with($toolName, self::TOOL_PREFIX)
            && in_array(substr($toolName, strlen(self::TOOL_PREFIX)), $this->names->toolNames(), true);
    }

    /**
     * Refuses a resource call that names another server or an address outside the journal's.
     *
     * @throws UnsupportedHook
     */
    public function requireJournalResource(string $driver, HookPayload $hookInput): void
    {
        $arguments = $hookInput->toolArguments();
        $server = $arguments->hasArgument('server') ? $arguments->textArgument('server') : self::SERVER;
        $uri = $arguments->hasArgument('uri') ? $arguments->textArgument('uri') : self::RESOURCE_SCHEME;

        if ($server !== self::SERVER || $uri === null || ! str_starts_with($uri, self::RESOURCE_SCHEME)) {
            throw UnsupportedHook::forResource($driver, $hookInput->toolNameText());
        }
    }
}
