<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Mcp;

use Domain\Helpers\HelpersDomain;
use Domain\Helpers\Mcp\Tools\StartHelperTool;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool StartHelperTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(StartHelperTool::class)]
final class StartHelperToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(HelpersDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('StartHelperTool', [
            'the argument profile_key',
            'the argument model',
            'the argument brief',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
