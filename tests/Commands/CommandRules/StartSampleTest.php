<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Commands\CommandRules\OpenCommandRequest\OpenCommandRequestCommand;
use App\Commands\CommandRules\ProposeCommandRule\ProposeCommandRuleCommand;
use App\Commands\CommandRules\StartSample\StartSampleCommand;
use App\Enums\CommandRules\RequestHoldReason;
use App\Exceptions\SampleRefused;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\ActsAsActors;
use Tests\Support\Processes\ProcessOutputDisk;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A sample run before the owner approved it is refused, naming the step it waits on.
 */
final class StartSampleTest extends TestCase
{
    use ActsAsActors;
    use RefreshHookDatabase;

    private const string OWNER_WAIT = 'waiting for the owner';

    private TestStart $start;

    private string $requestId;

    protected function setUp(): void
    {
        parent::setUp();

        ProcessOutputDisk::fake();
        $this->start = TestStart::start();
        $this->requestId = $this->journal->actAsAgentIds(
            $this->start->agent->id,
            $this->start->session->id,
        )->runUnkeyed(new OpenCommandRequestCommand(
            'acme verify',
            str_repeat('a', 64),
            'acme verify',
            sys_get_temp_dir(),
            RequestHoldReason::UnknownCommand,
        ));
        $this->journal->runAsStart(
            $this->start,
            new ProposeCommandRuleCommand($this->requestId, 'request-1', AcmeDeclarations::proposedVerify()),
        );
    }

    public function test_a_sample_run_before_the_owner_approved_is_refused_with_the_waiting_step(): void
    {
        try {
            $this->journal->runAsStart(
                $this->start,
                new StartSampleCommand($this->requestId, 'no-permit', 'first'),
            );
            $this->fail('The sample started without an approval.');
        } catch (SampleRefused $refusal) {
            $this->assertStringContainsString(self::OWNER_WAIT, $refusal->getMessage());
        }
    }
}
