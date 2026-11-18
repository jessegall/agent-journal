<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Bus\Contracts\CommandBus;
use App\Processes\Commands\ApproveSample;
use App\Processes\Commands\OpenCommandRequest;
use App\Processes\Commands\ProposeCommandRule;
use App\Processes\Commands\ProposeReader;
use App\Processes\Commands\ProveReader;
use App\Processes\Commands\SettleSample;
use App\Processes\Commands\StartSample;
use App\Processes\Enums\OutputStream;
use App\Processes\Enums\RecordRole;
use App\Processes\Enums\RequestHoldReason;
use App\Processes\Enums\RequestState;
use App\Processes\Exceptions\ReaderProofFailed;
use App\Processes\Exceptions\RevisionImmutable;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\PartRun;
use App\Processes\Models\ReaderProof;
use App\Processes\Models\ReaderRevision;
use App\Processes\Support\SpoolRecorder;
use App\Processes\Values\CapturedChunk;
use App\Processes\Values\PartEnd;
use App\Processes\Values\ReaderDefinition;
use App\Processes\Values\RecordRule;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Storage;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedCalls;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The journal proves a draft reader itself, by replaying it over real samples it captured for the request, one per
 * exit branch, after the request's actor read them (doc 21 revision 6, sections 71 and 72; stories 184, 185, 188 and
 * 201).
 */
final class ReaderProofTest extends TestCase
{
    use RefreshHookDatabase;
    use SendsSignedCalls;

    private const string PASSED = "{\"test\":\"a\",\"status\":\"ok\"}\n{\"passed\":1,\"failed\":0}\n";

    private const string FINDINGS = "{\"test\":\"a\",\"status\":\"fail\"}\n{\"passed\":0,\"failed\":1}\n";

    private TestLaunch $launch;

    private string $requestId;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake(SpoolRecorder::DISK);
        $this->launch = TestLaunch::start();
        $this->requestId = $this->asAgent(new OpenCommandRequest(
            'acme verify',
            str_repeat('a', 64),
            'acme verify',
            sys_get_temp_dir(),
            RequestHoldReason::UnknownCommand,
        ));
        $this->asAgent(new ProposeCommandRule($this->requestId, 'request-1', AcmeDeclarations::proposedVerify()));
    }

    public function test_a_reader_proven_on_a_passing_sample_alone_lists_the_other_branch_as_unproven(): void
    {
        $passed = $this->sample(0, self::PASSED, read: true);

        $refusal = $this->failedProof($this->reader(), [$passed]);

        $this->assertSame([1], $refusal->unprovenStatuses);
        $this->assertSame([], $refusal->failures);
        $this->assertSame(RequestState::AwaitingProof, $this->request()->state);
    }

    public function test_a_reader_that_leaves_an_error_line_unaccounted_fails_naming_its_offsets(): void
    {
        $passed = $this->sample(0, "error: disk full\n".self::PASSED, read: true);
        $findings = $this->sample(1, self::FINDINGS, read: true);

        $refusal = $this->failedProof($this->reader(), [$passed, $findings]);

        $this->assertStringContainsString('output_unrecognized at stdout bytes 0-16', implode(' ', $refusal->failures));
        $this->assertSame(0, ReaderProof::query()->count());
    }

    public function test_a_sample_its_author_never_read_proves_nothing(): void
    {
        $passed = $this->sample(0, self::PASSED, read: false);
        $findings = $this->sample(1, self::FINDINGS, read: true);

        $refusal = $this->failedProof($this->reader(), [$passed, $findings]);

        $this->assertStringContainsString('has not read', implode(' ', $refusal->failures));
    }

    public function test_samples_for_every_branch_prove_the_reader_and_the_request_awaits_approval(): void
    {
        $passed = $this->sample(0, self::PASSED, read: true);
        $findings = $this->sample(1, self::FINDINGS, read: true);
        $reader = $this->reader();

        $proofId = $this->asAgent(new ProveReader($this->requestId, $reader, [$passed, $findings]));

        $proof = ReaderProof::query()->findOrFail($proofId);
        $this->assertSame([0, 1], array_map(fn ($branch) => $branch->status, $proof->proven_branches));
        $this->assertArrayHasKey('stdout', $proof->proven_branches[0]->manifests);
        $this->assertSame(RequestState::AwaitingApproval, $this->request()->state);
        $this->assertTrue(ReaderRevision::query()->findOrFail($reader)->isProven());
        $proof->actor_id = 'someone-else';
        $this->assertThrows(fn () => $proof->save(), RevisionImmutable::class);
    }

    public function test_a_changed_reader_is_a_new_draft_without_a_proof(): void
    {
        $passed = $this->sample(0, self::PASSED, read: true);
        $findings = $this->sample(1, self::FINDINGS, read: true);
        $this->asAgent(new ProveReader($this->requestId, $this->reader(), [$passed, $findings]));

        $changed = ReaderRevision::query()->findOrFail($this->reader());

        $this->assertFalse($changed->isProven());
    }

    /**
     * @param  list<string>  $runs
     */
    private function failedProof(string $reader, array $runs): ReaderProofFailed
    {
        try {
            $this->asAgent(new ProveReader($this->requestId, $reader, $runs));
        } catch (ReaderProofFailed $refusal) {
            return $refusal;
        }
        $this->fail('The reader was proven.');
    }

    /**
     * A draft reader for the acme verify output: one outcome rule per status and the summary with its failures.
     */
    private function reader(): string
    {
        $definition = new ReaderDefinition([
            new RecordRule(RecordRole::Outcome, "test='{name:word}' status='ok'"),
            new RecordRule(RecordRole::Outcome, "test='{name:word}' status='fail'"),
            new RecordRule(RecordRole::Summary, 'passed={passed:int} failed={failed:int}'),
        ], failureField: 'failed');

        return $this->asAgent(new ProposeReader($this->requestId, 1, $definition));
    }

    /**
     * One owner-approved sample that ended with the status and wrote the output, read by the agent when asked.
     */
    private function sample(int $status, string $output, bool $read): string
    {
        $permit = $this->asUser(new ApproveSample($this->requestId, 1, $this->request()->source_digest));
        $runId = $this->asAgent(new StartSample($this->requestId, $permit, "sample-{$status}"));
        $part = PartRun::query()->create([
            'process_run_id' => $runId,
            'syntax_node' => 1,
            'part_id' => 'node-1',
            'attempt' => 1,
            'operation' => 'acme verify',
        ]);
        $part->start(1, 'host');
        $recorder = $this->app->make(SpoolRecorder::class);
        $recorder->append(new CapturedChunk($part, OutputStream::Stdout, $output, CarbonImmutable::now()));
        $part->finishProcess(PartEnd::exited($status));
        $part->finishDraining();
        $recorder->finish($part, PartEnd::exited($status));
        if ($read) {
            $this->signed($this->launch, "/agent/processes/runs/{$runId}/output", ['mode' => 'summary'])->assertOk();
            $tail = ['mode' => 'tail', 'part' => 1, 'stream' => 'stdout', 'tail' => 50];
            $this->signed($this->launch, "/agent/processes/runs/{$runId}/output", $tail)->assertOk();
        }
        $this->asAgent(new SettleSample($this->requestId));

        return $runId;
    }

    private function request(): CommandRequest
    {
        return CommandRequest::query()->findOrFail($this->requestId);
    }

    private function asAgent(object $command): mixed
    {
        return $this->runAs(ActorContext::forAgent($this->launch->agent->id), $command);
    }

    private function asUser(object $command): mixed
    {
        return $this->runAs(ActorContext::forUser(TestIds::of(7)), $command);
    }

    private function runAs(ActorContext $actor, object $command): mixed
    {
        $this->app->forgetScopedInstances();
        $this->app->make(CurrentActorSetter::class)->set($actor);

        return $this->app->make(CommandBus::class)->run($command);
    }
}
