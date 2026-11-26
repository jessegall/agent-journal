<?php

declare(strict_types=1);

namespace Tests\Architecture\Support\EntryPoints;

use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Entries\Attributes\TestsHook;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\Support\Entries\Attributes\TestsRead;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Attributes\TestsState;
use Tests\Support\Entries\Contracts\NamesEntry;

/**
 * The ways into the journal a test is written for, each with the attribute that names it and its tests' folder.
 */
enum EntryType: string
{
    case Command = 'command';
    case State = 'state';
    case Route = 'route method';
    case McpTool = 'MCP tool';
    case Hook = 'hook moment';
    case Middleware = 'middleware';
    case Read = 'read';

    /**
     * The folder under tests, or under a domain's tests, that holds this type's tests.
     */
    public function folder(): string
    {
        return match ($this) {
            self::Command => 'Commands',
            self::State => 'States',
            self::Route => 'Routes',
            self::McpTool => 'Mcp',
            self::Hook => 'Hooks',
            self::Middleware => 'Middleware',
            self::Read => 'Reads',
        };
    }

    /**
     * @return class-string<NamesEntry>
     */
    public function attribute(): string
    {
        return match ($this) {
            self::Command => TestsCommand::class,
            self::State => TestsState::class,
            self::Route => TestsRoute::class,
            self::McpTool => TestsMcpTool::class,
            self::Hook => TestsHook::class,
            self::Middleware => TestsMiddleware::class,
            self::Read => TestsRead::class,
        };
    }

    /**
     * Whether a test of this type names one entry only: a command, state, tool, middleware or read test names one
     * alone.
     */
    public function isOnePerTest(): bool
    {
        return $this !== self::Route && $this !== self::Hook;
    }

    /**
     * Whether one test class alone may name an entry of this type: every type but a read, which several tests may read.
     */
    public function hasOneTestClass(): bool
    {
        return $this !== self::Read;
    }

    /**
     * Whether each entry of this type has one test file at a set path: a command, state or middleware does, while a
     * route, tool, hook moment or read's test may sit anywhere in its folder.
     */
    public function hasTestFile(): bool
    {
        return $this === self::Command || $this === self::State || $this === self::Middleware;
    }

    /**
     * Whether a domain has a folder of this type's tests; the hook moments are core's alone.
     */
    public function hasDomainFolder(): bool
    {
        return $this !== self::Hook;
    }
}
