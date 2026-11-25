<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Mcp;

use Domain\Memory\Mcp\Tools\MemoriesListTool;
use Domain\Memory\MemoryDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool MemoriesListTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(MemoriesListTool::class)]
final class MemoriesListToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(MemoryDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        return ToolCall::by($journal->owner()->signedStart('Agent'));
    }
}
