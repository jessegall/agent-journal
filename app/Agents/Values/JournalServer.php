<?php

declare(strict_types=1);

namespace App\Agents\Values;

/**
 * How a start runs the journal's MCP server, by absolute path or a host name, with no token in it: a PHP binary
 * running the relay script, or a standalone relay that is the command itself.
 */
final readonly class JournalServer
{
    public function __construct(
        public string $command,
        public string|null $relay = null,
    ) {}

    /**
     * @return list<string>
     */
    public function arguments(): array
    {
        if ($this->relay === null) {
            return [];
        }

        return [$this->relay];
    }
}
