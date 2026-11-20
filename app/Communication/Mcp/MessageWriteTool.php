<?php

declare(strict_types=1);

namespace App\Communication\Mcp;

use App\Mcp\Data\ToolResult;
use App\Mcp\Tools\JournalWriteTool;

/**
 * A messaging write: one command run under the request key the caller sends, so sending it again under the same key
 * answers from its receipt instead of writing twice.
 */
abstract class MessageWriteTool extends JournalWriteTool
{
    final protected function present(mixed $answer): ToolResult
    {
        return ToolResult::ok($this->payload($answer), []);
    }

    /**
     * @return array<string, mixed>
     */
    abstract protected function payload(mixed $messageAnswer): array;
}
