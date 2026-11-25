<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Mcp;

use Domain\Plans\Mcp\Tools\ReassignPlanWorkTool;
use Domain\Plans\PlansDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool ReassignPlanWorkTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(ReassignPlanWorkTool::class)]
final class ReassignPlanWorkToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('ReassignPlanWorkTool', [
            'the argument root',
            'the argument expected_assignment',
            'the argument recipient',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
