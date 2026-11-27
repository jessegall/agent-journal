<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Mcp\Resources\JournalResource;
use App\Mcp\Tools\JournalTool;

/**
 * The tools and resources the journal's server offers one start: the whole catalogue to a start on MCP transport,
 * nothing to one on the CLI, whose agent reaches the journal through its commands.
 */
final readonly class McpOffer
{
    /**
     * @param  list<class-string<JournalTool>>  $tools
     * @param  list<class-string<JournalResource>>  $resources
     */
    public function __construct(public array $tools, public array $resources) {}

    public static function nothing(): self
    {
        return new self([], []);
    }

    public function offersTools(): bool
    {
        return $this->tools !== [];
    }
}
