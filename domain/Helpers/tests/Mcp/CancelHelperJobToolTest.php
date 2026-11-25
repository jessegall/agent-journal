<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Mcp;

use Domain\Helpers\Commands\CancelHelperJob\CancelHelperJobCommand;
use Domain\Helpers\HelpersDomain;
use Domain\Helpers\Mcp\Tools\CancelHelperJobTool;
use Domain\Helpers\Tests\Fixtures\HelperFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A main agent cancels a helper's job.
 */
#[TestsMcpTool(CancelHelperJobTool::class)]
final class CancelHelperJobToolTest extends McpToolEntryTestCase
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
                'job_id' => $helpers->jobCalled('Review')->id,
                'request_key' => 'helper-1',
            ])
            ->reply(CancelHelperJobCommand::class, $helpers->jobCalled('Review')->id)
            ->expects(CancelHelperJobCommand::class, ['jobId' => $helpers->jobCalled('Review')->id]);
    }
}
