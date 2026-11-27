<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Exceptions\ProfileRefused;

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
     * The server, once its command and each argument is a path already resolved on the host, as a driver's server
     * descriptor names them.
     *
     * @throws ProfileRefused
     */
    public function resolved(): self
    {
        foreach ([$this->command, ...$this->arguments()] as $path) {
            if (! new HostPath($path)->isResolved()) {
                throw ProfileRefused::unresolvedSetting("the journal MCP path {$path}");
            }
        }

        return $this;
    }

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
