<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Mcp;

use Domain\Helpers\Commands\SteerHelper\SteerHelperCommand;
use Domain\Helpers\HelpersDomain;
use Domain\Helpers\Mcp\Tools\SteerHelperTool;
use Domain\Helpers\Tests\Fixtures\HelperFixtures;
use Domain\Helpers\Values\SteerReceipt;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A main agent adds a line to a helper's running job.
 */
#[TestsMcpTool(SteerHelperTool::class)]
final class SteerHelperToolTest extends McpToolEntryTestCase
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
                'identity_id' => $helpers->identityOf('Review')->id,
                'text' => 'Look at the tests too.',
                'request_key' => 'helper-1',
            ])
            ->reply(SteerHelperCommand::class, SteerReceipt::steered($helpers->jobCalled('Review')->id))
            ->expects(ExpectedCommand::of(SteerHelperCommand::class, [
                'identityId' => $helpers->identityOf('Review')->id,
                'text' => 'Look at the tests too.',
            ]));
    }
}
