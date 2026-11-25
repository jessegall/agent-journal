<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Mcp;

use Domain\Helpers\Commands\ContinueHelper\ContinueHelperCommand;
use Domain\Helpers\HelpersDomain;
use Domain\Helpers\Mcp\Tools\ContinueHelperTool;
use Domain\Helpers\Tests\Fixtures\HelperFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A main agent continues a helper on the job it had, and is given its receipt.
 */
#[TestsMcpTool(ContinueHelperTool::class)]
final class ContinueHelperToolTest extends McpToolEntryTestCase
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
                'job_id' => $helpers->jobCalled('Review')->id,
                'model' => 'claude-sonnet-5-5',
                'request_key' => 'helper-1',
            ])
            ->reply(ContinueHelperCommand::class, $helpers->receiptOf('Review'))
            ->expects(ContinueHelperCommand::class, [
                'identityId' => $helpers->identityOf('Review')->id,
                'jobId' => $helpers->jobCalled('Review')->id,
            ]);
    }
}
