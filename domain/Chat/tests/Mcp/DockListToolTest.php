<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Mcp;

use Domain\Chat\ChatDomain;
use Domain\Chat\Mcp\Tools\DockListTool;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool DockListTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(DockListTool::class)]
final class DockListToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        return ToolCall::by($journal->owner()->signedStart('Agent'));
    }
}
