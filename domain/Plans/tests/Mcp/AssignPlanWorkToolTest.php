<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Mcp;

use Domain\Plans\Mcp\Tools\AssignPlanWorkTool;
use Domain\Plans\PlansDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool AssignPlanWorkTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(AssignPlanWorkTool::class)]
final class AssignPlanWorkToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('AssignPlanWorkTool', [
            'the argument root',
            'the argument recipient',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
