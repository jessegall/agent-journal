<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Processes\Enums\OutputStream;
use App\Processes\Enums\RunMode;
use App\Processes\Enums\ShellDialect;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\SpoolRecorder;
use App\Processes\Values\CapturedChunk;
use App\Processes\Values\PartEnd;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Storage;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedCalls;
use Tests\Support\TestRunAdmissions;
use Tests\TestCase;

/**
 * An agent reads its runs' stored output afterwards without running anything again; another agent finds nothing (doc
 * 21 revision 6, section 54; stories 119, 124, 166 and 200).
 */
final class StoredOutputReadTest extends TestCase
{
    use RefreshHookDatabase;
    use SendsSignedCalls;

    private TestLaunch $launch;

    private ProcessRun $run;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake(SpoolRecorder::DISK);
        $this->launch = TestLaunch::start();
        $this->run = ProcessRun::admit(new ActorIdentity(ActorType::Agent, $this->launch->agent->id), TestRunAdmissions::of(admissionId: 'stored-output'));
        $part = PartRun::query()->create(['process_run_id' => $this->run->id, 'syntax_node' => 1, 'part_id' => 'node-1', 'attempt' => 1, 'operation' => 'tool']);
        $part->start(1, 'host');
        $lines = implode('', array_map(fn (int $line) => "line {$line}".($line === 50 ? ' error' : '')."\n", range(1, 100)));
        $this->app->make(SpoolRecorder::class)->append(new CapturedChunk($part, OutputStream::Stdout, $lines."\x00\xff end\n", CarbonImmutable::now()));
        $part->finishProcess(PartEnd::exited(1));
        $part->finishDraining();
    }

    public function test_the_tail_shows_the_last_lines_escaped_and_the_bytes_before_them(): void
    {
        $reply = $this->signed($this->launch, "/agent/processes/runs/{$this->run->id}/output", ['mode' => 'tail', 'part' => 1, 'tail' => 2])->assertOk();

        $this->assertSame("line 100\n\\x00\\xFF end", $reply->json('text'));
        $this->assertGreaterThan(0, $reply->json('before'));
        $this->assertSame('diagnostic output', $reply->json('label'));
    }

    public function test_a_search_lists_offsets_and_the_summary_keeps_the_own_exit(): void
    {
        $this->assertCount(1, $this->signed($this->launch, "/agent/processes/runs/{$this->run->id}/output", ['mode' => 'search', 'part' => 1, 'search' => 'error'])->json('offsets'));
        $summary = $this->signed($this->launch, "/agent/processes/runs/{$this->run->id}/output", ['mode' => 'summary']);
        $this->assertSame(1, $summary->json('parts.0.code'), (string) $summary->getContent());
    }

    public function test_another_agent_finds_no_run(): void
    {
        $this->signed(TestLaunch::start(), "/agent/processes/runs/{$this->run->id}/output", ['mode' => 'summary'])->assertNotFound();
    }
}
