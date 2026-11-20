<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Processes\Commands\OpenCommandRequest;
use App\Processes\Commands\ProposeCommandRule;
use App\Processes\Enums\OutputStream;
use App\Processes\Enums\RequestHoldReason;
use App\Processes\Enums\RequestState;
use App\Processes\Enums\RunMode;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Models\ReaderRevision;
use App\Processes\Support\SpoolRecorder;
use App\Processes\Values\CapturedChunk;
use App\Processes\Values\PartEnd;
use App\Processes\Values\PartKey;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Storage;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedCalls;
use Tests\Support\StartsTestAgent;
use Tests\Support\TestRunAdmissions;
use Tests\TestCase;

/**
 * An agent proposes a draft reader for its request's declaration, and the journal records which parts of a sample run
 * it read (doc 21 revision 6, sections 71 and 72; stories 180, 181 and 202).
 */
final class ReaderProposalTest extends TestCase
{
    use RefreshHookDatabase;
    use SendsSignedCalls;
    use StartsTestAgent;

    private CommandRequest $request;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake(SpoolRecorder::DISK);
        $requestId = $this->runAsAgent(new OpenCommandRequest(
            'acme verify',
            str_repeat('a', 64),
            'acme verify',
            '/projects/acme',
            RequestHoldReason::UnknownCommand,
        ));
        $this->runAsAgent(new ProposeCommandRule($requestId, 'request-1', AcmeDeclarations::proposedVerify()));
        $this->request = CommandRequest::query()->findOrFail($requestId);
    }

    public function test_a_proposed_reader_is_a_draft_that_unlocks_nothing(): void
    {
        $reply = $this->proposeReader($this->definition(withSummary: true))->assertOk();

        $revision = ReaderRevision::query()->findOrFail($reply->json('reader_revision_id'));
        $this->assertFalse($revision->isProven());
        $this->assertSame($this->request->id, $revision->command_request_id);
        $this->assertSame(1, $revision->declaration_revision);
        $this->assertSame('acme verify', $revision->operation);
        $this->assertSame(RequestState::AwaitingSampleApproval, $this->request->refresh()->state);
    }

    public function test_a_definition_without_the_summary_rule_the_contract_requires_is_refused(): void
    {
        $reply = $this->proposeReader($this->definition(withSummary: false))->assertStatus(422);

        $this->assertStringContainsString('summary rule', (string) $reply->json('message'));
        $this->assertSame(0, ReaderRevision::query()->count());
    }

    public function test_a_reader_for_a_missing_declaration_revision_is_refused(): void
    {
        $this->signed($this->start, "/agent/processes/requests/{$this->request->id}/readers", [
            'declaration_revision' => 2,
            'definition' => $this->definition(withSummary: true),
        ])->assertStatus(409);
    }

    public function test_the_evidence_counts_as_read_only_after_the_envelope_and_every_written_stream(): void
    {
        $run = $this->sampleRun();
        $this->assertFalse($this->request->hasReadEvidence($run));

        $this->readOutput($run, 'summary', []);
        $this->readOutput($run, 'tail', ['part' => 1, 'stream' => 'stdout', 'lines' => 5]);
        $this->assertFalse($this->request->hasReadEvidence($run));

        $this->readOutput($run, 'tail', ['part' => 1, 'stream' => 'stderr', 'lines' => 5]);
        $this->assertTrue($this->request->hasReadEvidence($run));
    }

    public function test_stream_reads_without_the_envelope_do_not_count(): void
    {
        $run = $this->sampleRun();

        $this->readOutput($run, 'tail', ['part' => 1, 'stream' => 'stdout', 'lines' => 5]);
        $this->readOutput($run, 'tail', ['part' => 1, 'stream' => 'stderr', 'lines' => 5]);

        $this->assertFalse($this->request->hasReadEvidence($run));
    }

    /**
     * @param  array<string, mixed>  $definition
     */
    private function proposeReader(array $definition): TestResponse
    {
        return $this->signed($this->start, "/agent/processes/requests/{$this->request->id}/readers", [
            'declaration_revision' => 1,
            'definition' => $definition,
        ]);
    }

    /**
     * @param  array<string, mixed>  $body
     */
    private function readOutput(ProcessRun $run, string $read, array $body): void
    {
        $this->signed($this->start, "/agent/processes/runs/{$run->id}/output/{$read}", $body)->assertOk();
    }

    /**
     * @return array<string, mixed>
     */
    private function definition(bool $withSummary): array
    {
        $rules = [['role' => 'outcome', 'pattern' => '^ok {name:rest}$']];
        if ($withSummary) {
            $rules[] = ['role' => 'summary', 'pattern' => '^done {passed:int} {failed:int}$'];
        }

        return [
            'rules' => $rules,
            'count_fields' => [],
            'total_field' => null,
            'failure_field' => null,
            'max_record_bytes' => 65_536,
            'millisecond_budget' => 2_000,
        ];
    }

    private function sampleRun(): ProcessRun
    {
        $run = ProcessRun::admit(
            new ActorIdentity(ActorType::Agent, $this->start->agent->id),
            TestRunAdmissions::of(
                admissionId: 'sample',
                mode: RunMode::Evidence,
                projectKey: $this->request->project_key,
            ),
        );
        $part = PartRun::queue($run, new PartKey(1, 1, 'acme verify'));
        $part->start('host', 1);
        $recorder = $this->app->make(SpoolRecorder::class);
        $now = CarbonImmutable::now();
        $recorder->append(new CapturedChunk($part, OutputStream::Stdout, <<<'TEXT'
        ok first
        done 1 0

        TEXT, $now));
        $recorder->append(new CapturedChunk($part, OutputStream::Stderr, "warning\n", $now));
        $part->finishProcess(PartEnd::exited(0));
        $part->finishDraining();

        return $run;
    }
}
