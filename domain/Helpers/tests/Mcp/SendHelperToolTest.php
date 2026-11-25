<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Mcp;

use Domain\Helpers\HelpersDomain;
use Domain\Helpers\Mcp\Tools\SendHelperTool;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool SendHelperTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(SendHelperTool::class)]
final class SendHelperToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(HelpersDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('SendHelperTool', [
            'the argument identity_id',
            'the argument profile_key',
            'the argument model',
            'the argument brief',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
