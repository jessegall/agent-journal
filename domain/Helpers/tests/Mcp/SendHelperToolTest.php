<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Mcp;

use Domain\Helpers\Commands\SendHelper\SendHelperCommand;
use Domain\Helpers\HelpersDomain;
use Domain\Helpers\Mcp\Tools\SendHelperTool;
use Domain\Helpers\Tests\Fixtures\HelperFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A main agent sends a kept helper a new job, and is given its receipt.
 */
#[TestsMcpTool(SendHelperTool::class)]
final class SendHelperToolTest extends McpToolEntryTestCase
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
                'profile_key' => 'writing-helper',
                'model' => 'claude-sonnet-5-5',
                'brief' => 'Review the change.',
                'request_key' => 'helper-1',
            ])
            ->reply(SendHelperCommand::class, $helpers->receiptOf('Review'))
            ->expects(SendHelperCommand::class, [
                'identityId' => $helpers->identityOf('Review')->id,
                'profileKey' => 'writing-helper',
            ]);
    }
}
