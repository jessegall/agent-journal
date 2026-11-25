<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Mcp;

use Domain\Plans\Commands\CreatePlan\CreatePlanCommand;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Mcp\Tools\CreatePlanTool;
use Domain\Plans\PlansDomain;
use Illuminate\Support\Str;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent drafts a plan with a title, a brief and its type, and is given the plan.
 */
#[TestsMcpTool(CreatePlanTool::class)]
final class CreatePlanToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Planner');

        return ToolCall::by($start)
            ->arguments(['title' => 'Release', 'brief' => 'Ship version 6.', 'type' => 'build', 'request_key' => 'plans-1'])
            ->reply(CreatePlanCommand::class, (string) Str::ulid())
            ->expects(ExpectedCommand::of(CreatePlanCommand::class, ['title' => 'Release', 'brief' => 'Ship version 6.', 'type' => PlanType::Build]));
    }
}
