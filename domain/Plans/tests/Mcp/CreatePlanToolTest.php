<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Mcp;

use Domain\Plans\Mcp\Tools\CreatePlanTool;
use Domain\Plans\PlansDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool CreatePlanTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(CreatePlanTool::class)]
final class CreatePlanToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('CreatePlanTool', [
            'the argument title',
            'the argument brief',
            'the argument type',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
