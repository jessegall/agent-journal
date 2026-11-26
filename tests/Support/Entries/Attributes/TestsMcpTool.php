<?php

declare(strict_types=1);

namespace Tests\Support\Entries\Attributes;

use App\CommandRules\Mcp\Tools\JournalTool;
use Attribute;
use Tests\Support\Entries\Contracts\NamesEntry;

/**
 * The MCP tool a test class is the one test of.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class TestsMcpTool implements NamesEntry
{
    /**
     * @param  class-string<JournalTool>  $tool
     */
    public function __construct(public string $tool) {}

    public function entryName(): string
    {
        return $this->tool;
    }
}
