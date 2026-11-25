<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Mcp;

use Domain\Helpers\HelpersDomain;
use Domain\Helpers\Mcp\Tools\ContinueHelperTool;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool ContinueHelperTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(ContinueHelperTool::class)]
final class ContinueHelperToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(HelpersDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('ContinueHelperTool', [
            'the argument identity_id',
            'the argument job_id',
            'the argument model',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
