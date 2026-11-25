<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Mcp;

use Domain\Helpers\HelpersDomain;
use Domain\Helpers\Mcp\Tools\SteerHelperTool;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool SteerHelperTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(SteerHelperTool::class)]
final class SteerHelperToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(HelpersDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('SteerHelperTool', [
            'the argument identity_id',
            'the argument text',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
