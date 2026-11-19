<?php

declare(strict_types=1);

namespace App\Communication\Mcp;

use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;

/**
 * A messaging write: one command run under the request key the caller sends, so sending it again under the same key
 * answers from its receipt instead of writing twice.
 */
abstract class MessageWriteTool extends JournalWriteTool
{
    public function __construct(
        private readonly CommandBus $commands,
        private readonly RequestKey $requestKey,
    ) {}

    final protected function write(ToolArguments $arguments): ToolResult
    {
        $this->requestKey->set($arguments->text('request_key'));

        try {
            return ToolResult::ok($this->payload($this->commands->run($this->command($arguments))), []);
        } finally {
            $this->requestKey->forget();
        }
    }

    /**
     * @return Command<mixed>
     */
    abstract protected function command(ToolArguments $arguments): Command;

    /**
     * @return array<string, mixed>
     */
    abstract protected function payload(mixed $result): array;
}
