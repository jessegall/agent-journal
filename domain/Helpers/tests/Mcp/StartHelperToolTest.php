<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Mcp;

use Domain\Helpers\Commands\StartHelper\StartHelperCommand;
use Domain\Helpers\HelpersDomain;
use Domain\Helpers\Mcp\Tools\StartHelperTool;
use Domain\Helpers\Tests\Fixtures\HelperFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A main agent starts a helper of a profile on a model with a brief, and is given its receipt.
 */
#[TestsMcpTool(StartHelperTool::class)]
final class StartHelperToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(HelpersDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Planner');
        $helpers = $journal->fixtures(HelperFixtures::class)->openJob('Review', 'Planner', 'Review the change.');

        return ToolCall::by($start)
            ->arguments([
                'profile_key' => 'writing-helper',
                'model' => 'claude-sonnet-5-5',
                'brief' => 'Review the change.',
                'request_key' => 'helper-1',
            ])
            ->reply(StartHelperCommand::class, $helpers->receiptOf('Review'))
            ->expects(StartHelperCommand::class, [
                'profileKey' => 'writing-helper',
                'model' => 'claude-sonnet-5-5',
            ]);
    }
}
