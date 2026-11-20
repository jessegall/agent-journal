<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Bus\Exceptions\CommandAdmissionRefused;
use App\Processes\Commands\ApproveSample;
use App\Processes\Commands\OpenCommandRequest;
use App\Processes\Commands\ProposeCommandRule;
use App\Processes\Commands\SettleSample;
use App\Processes\Commands\StartSample;
use App\Processes\Enums\OutputStream;
use App\Processes\Enums\RequestHoldReason;
use App\Processes\Enums\RequestState;
use App\Processes\Exceptions\SampleRefused;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\EvidencePermit;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\SpoolRecorder;
use App\Processes\Values\CapturedChunk;
use App\Processes\Values\CommandRule;
use App\Processes\Values\PartEnd;
use App\Processes\Values\PartKey;
use App\Processes\Values\SampleOutcome;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Storage;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\ActsAsActors;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsCommandsAsStart;
use Tests\TestCase;

/**
 * A project owner approves one evidence sample of a request's exact line; the request's actor runs it once and the
 * request moves on to its proof, or back to the owner when the capture failed (doc 21 revision 6, sections 71 and 72;
 * stories 182, 183 and 185).
 */
final class SampleWorkflowTest extends TestCase
{
    use ActsAsActors;
    use RefreshHookDatabase;
    use RunsCommandsAsStart;

    private TestStart $start;

    private string $requestId;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake(SpoolRecorder::DISK);
        $this->start = TestStart::start();
        $this->requestId = $this->runAsAgent(new OpenCommandRequest(
            'acme verify',
            str_repeat('a', 64),
            'acme verify',
            sys_get_temp_dir(),
            RequestHoldReason::UnknownCommand,
        ));
        $this->runAsAgent(new ProposeCommandRule($this->requestId, 'request-1', AcmeDeclarations::proposedVerify()));
    }

    public function test_a_sample_run_before_the_owner_approved_is_refused_with_the_waiting_step(): void
    {
        try {
            $this->runAsAgent(new StartSample($this->requestId, 'no-permit', 'first'));
            $this->fail('The sample started without an approval.');
        } catch (SampleRefused $refusal) {
            $this->assertStringContainsString('waiting for the owner', $refusal->getMessage());
        }
    }

    public function test_an_agent_cannot_approve_a_sample(): void
    {
        $this->assertThrows(fn () => $this->runAsAgent($this->approval()), CommandAdmissionRefused::class);
        $this->assertSame(0, EvidencePermit::query()->count());
    }

    public function test_the_approved_sample_runs_once_and_the_request_awaits_proof_with_the_run(): void
    {
        $permitId = $this->asUser($this->approval());
        $this->assertSame(RequestState::ReadyForSample, $this->request()->state);

        $runId = $this->runAsAgent(new StartSample($this->requestId, $permitId, 'first'));
        $this->assertSame($runId, $this->runAsAgent(new StartSample($this->requestId, $permitId, 'first')));
        $this->assertSame(RequestState::CapturingSample, $this->request()->state);
        $this->assertThrows(
            fn () => $this->runAsAgent(new StartSample($this->requestId, $permitId, 'second')),
            SampleRefused::class,
        );

        $this->endRun($runId, 0);
        $outcome = $this->settle();

        $this->assertSame(RequestState::AwaitingProof, $outcome->state);
        $this->assertSame($runId, $outcome->runId);
        $this->assertSame([1], $outcome->unsampledStatuses);
        $this->assertSame($runId, EvidencePermit::query()->findOrFail($permitId)->process_run_id);
    }

    public function test_a_failed_capture_returns_the_request_to_the_owner(): void
    {
        $permitId = $this->asUser($this->approval());
        $runId = $this->runAsAgent(new StartSample($this->requestId, $permitId, 'first'));

        $part = $this->part($runId);
        $part->start(1, 'host');
        $part->finishProcess(PartEnd::exited(0));
        $part->finishDraining();

        $this->assertSame(RequestState::AwaitingSampleApproval, $this->settle()->state);
    }

    public function test_a_declaration_without_effects_cannot_be_approved_for_a_sample(): void
    {
        $other = $this->runAsAgent(new OpenCommandRequest(
            'acme verify',
            str_repeat('c', 64),
            'acme verify --all',
            sys_get_temp_dir(),
            RequestHoldReason::UnknownCommand,
        ));
        $rule = AcmeDeclarations::verify()->toArray();
        $rule['classes'] = [];
        $noEffects = AcmeDeclarations::proposed(CommandRule::fromArray($rule));
        $this->runAsAgent(new ProposeCommandRule($other, 'request-2', $noEffects));
        $digest = CommandRequest::query()->findOrFail($other)->source_digest;

        $this->assertThrows(fn () => $this->asUser(new ApproveSample($other, 1, $digest)), SampleRefused::class);
    }

    private function approval(): ApproveSample
    {
        return new ApproveSample($this->requestId, 1, $this->request()->source_digest);
    }

    private function settle(): SampleOutcome
    {
        return $this->runAsAgent(new SettleSample($this->requestId));
    }

    private function endRun(string $runId, int $status): void
    {
        $part = $this->part($runId);
        $part->start(1, 'host');
        $recorder = $this->app->make(SpoolRecorder::class);
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
        return PartRun::queue(
            ProcessRun::query()->withoutGlobalScopes()->findOrFail($runId),
            new PartKey(1, 1, 'acme verify'),
        );
    }

    private function request(): CommandRequest
    {
        return CommandRequest::query()->findOrFail($this->requestId);
    }
}
