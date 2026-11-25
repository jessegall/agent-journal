<?php

declare(strict_types=1);

namespace Tests\Support\Entries\Attributes;

use App\Mcp\Tools\JournalTool;
use Attribute;

/**
 * The MCP tool a test class is the one test of.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class TestsMcpTool
{
    /**
     * @param  class-string<JournalTool>  $tool
     */
    public function __construct(public string $tool) {}
}
