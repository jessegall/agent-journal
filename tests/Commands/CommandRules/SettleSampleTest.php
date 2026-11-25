<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Commands\CommandRules\ApproveSample\ApproveSampleCommand;
use App\Commands\CommandRules\OpenCommandRequest\OpenCommandRequestCommand;
use App\Commands\CommandRules\ProposeCommandRule\ProposeCommandRuleCommand;
use App\Commands\CommandRules\SettleSample\SettleSampleCommand;
use App\Commands\CommandRules\StartSample\StartSampleCommand;
use App\Enums\CommandRules\RequestHoldReason;
use App\Enums\CommandRules\RequestStatus;
use App\Enums\Processes\OutputStream;
use App\Exceptions\SampleRefused;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\EvidencePermit;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Support\OutputRecorder;
use App\Values\CapturedChunk;
use App\Values\PartEnd;
use App\Values\PartKey;
use App\Values\SampleOutcome;
use Carbon\CarbonImmutable;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\ActsAsActors;
use Tests\Support\Processes\ProcessOutputDisk;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsCommandsAsStart;
use Tests\TestCase;

/**
 * An approved sample runs once and leaves the request awaiting proof with the run; a failed capture gives the request
 * back to the owner.
 */
final class SettleSampleTest extends TestCase
{
    use ActsAsActors;
    use RefreshHookDatabase;
    use RunsCommandsAsStart;

    private TestStart $start;

    private string $requestId;

    protected function setUp(): void
    {
        parent::setUp();

        ProcessOutputDisk::fake();
        $this->start = TestStart::start();
        $this->requestId = $this->runAsAgent(new OpenCommandRequestCommand(
            'acme verify',
            str_repeat('a', 64),
            'acme verify',
            sys_get_temp_dir(),
            RequestHoldReason::UnknownCommand,
        ));
        $this->runAsAgent(new ProposeCommandRuleCommand($this->requestId, 'request-1', AcmeDeclarations::proposedVerify()));
    }

    public function test_the_approved_sample_runs_once_and_the_request_awaits_proof_with_the_run(): void
    {
        $permitId = $this->asUser($this->approval());
        $this->assertSame(RequestStatus::ReadyForSample, $this->request()->status);

        $runId = $this->runAsAgent(new StartSampleCommand($this->requestId, $permitId, 'first'));
        $this->assertSame($runId, $this->runAsAgent(new StartSampleCommand($this->requestId, $permitId, 'first')));
        $this->assertSame(RequestStatus::CapturingSample, $this->request()->status);
        $this->assertThrows(
            fn () => $this->runAsAgent(new StartSampleCommand($this->requestId, $permitId, 'second')),
            SampleRefused::class,
        );

        $this->endRun($runId, 0);
        $outcome = $this->settle();

        $this->assertSame(RequestStatus::AwaitingProof, $outcome->state);
        $this->assertSame($runId, $outcome->runId);
        $this->assertSame([1], $outcome->unsampledStatuses);
        $this->assertSame($runId, EvidencePermit::query()->findOrFail($permitId)->process_run_id);
    }

    public function test_a_failed_capture_returns_the_request_to_the_owner(): void
    {
        $permitId = $this->asUser($this->approval());
        $runId = $this->runAsAgent(new StartSampleCommand($this->requestId, $permitId, 'first'));

        $part = $this->part($runId);
        $part->start('host', 1);
        $part->finishProcess(PartEnd::exited(0));
        $part->finishDraining();

        $this->assertSame(RequestStatus::AwaitingSampleApproval, $this->settle()->state);
    }

    private function approval(): ApproveSampleCommand
    {
        return new ApproveSampleCommand($this->requestId, 1, $this->request()->source_digest);
    }

    private function settle(): SampleOutcome
    {
        return $this->runAsAgent(new SettleSampleCommand($this->requestId));
    }

    private function endRun(string $runId, int $status): void
    {
        $part = $this->part($runId);
        $part->start('host', 1);
        $recorder = $this->app->make(OutputRecorder::class);
        $chunk = new CapturedChunk($part, OutputStream::Stdout, <<<'TEXT'
        ok first
        done 1 0

        TEXT, CarbonImmutable::now());
        $recorder->append($chunk);
        $part->finishProcess(PartEnd::exited($status));
        $part->finishDraining();
        $recorder->finish($part, PartEnd::exited($status));
    }

    private function part(string $runId): PartRun
    {
        return PartRun::create(
            ProcessRun::query()->withoutGlobalScopes()->findOrFail($runId),
            new PartKey(1, 1, 'acme verify'),
        );
    }

    private function request(): CommandRequest
    {
        return CommandRequest::query()->findOrFail($this->requestId);
    }
}
