<?php

declare(strict_types=1);

namespace Domain\Memory\Support;

use App\Support\ReadToolSearchAccess;
use Domain\Memory\Support\Mcp\MemoryReadResult;

/**
 * Who may find and open a memory through search: the memory read tool opens it, and the provider keeps every search to
 * the caller's own memories.
 */
final readonly class MemorySearchAccess extends ReadToolSearchAccess
{
    public const string ID_ARGUMENT = 'memory_id';

    protected function readName(): string
    {
        return MemoryReadResult::TOOL;
    }

    protected function idArgument(): string
    {
        return self::ID_ARGUMENT;
    }
}
