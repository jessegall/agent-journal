<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\AssigneesListTool;
use Domain\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The agents work may be given to are listed for a main agent; a helper does not see the tool.
 */
#[TestsMcpTool(AssigneesListTool::class)]
final class AssigneesListToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        return ToolCall::by($journal->owner()->signedStart('Planner'))
            ->arguments(['type' => 'agent'])
            ->hiddenFromProfile('read-only-helper');
    }
}
