<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Processes\Enums\OutputStream;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\SpoolRecorder;
use App\Processes\Values\CapturedChunk;
use App\Processes\Values\PartEnd;
use App\Processes\Values\PartKey;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Storage;
use Tests\Fixtures\Agents\TestStart;
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

    private TestStart $start;

    private ProcessRun $run;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake(SpoolRecorder::DISK);
        $this->start = TestStart::start();
        $this->run = ProcessRun::create(
            new ActorIdentity(ActorType::Agent, $this->start->agent->id),
            TestRunAdmissions::of(admissionId: 'stored-output'),
        );
        $part = PartRun::create($this->run, new PartKey(1, 1, 'tool'));
        $part->start('host', 1);
        $lines = implode(
            '',
            array_map(fn (int $line) => "line {$line}".($line === 50 ? ' error' : '')."\n", range(1, 100)),
        );
        $this->app->make(SpoolRecorder::class)->append(
            new CapturedChunk($part, OutputStream::Stdout, $lines."\x00\xff end\n", CarbonImmutable::now()),
        );
        $part->finishProcess(PartEnd::exited(1));
        $part->finishDraining();
    }

    public function test_the_tail_shows_the_last_lines_escaped_and_the_bytes_before_them(): void
    {
        $reply = $this->signed(
            $this->start,
            "/agent/processes/runs/{$this->run->id}/output/tail",
            ['part' => 1, 'lines' => 2],
        )->assertOk();

        $this->assertSame("line 100\n\\x00\\xFF end", $reply->json('text'));
        $this->assertGreaterThan(0, $reply->json('before'));
        $this->assertSame('diagnostic output', $reply->json('label'));
    }

    public function test_a_search_lists_offsets_and_the_summary_keeps_the_own_exit(): void
    {
        $this->assertCount(
            1,
            $this->signed(
                $this->start,
                "/agent/processes/runs/{$this->run->id}/output/search",
                ['part' => 1, 'text' => 'error'],
            )->json('offsets'),
        );
        $summary = $this->signed($this->start, "/agent/processes/runs/{$this->run->id}/output/summary", []);
        $this->assertSame(1, $summary->json('parts.0.code'), (string) $summary->getContent());
    }

    public function test_another_agent_finds_no_run(): void
    {
        $this->signed(
            TestStart::start(),
            "/agent/processes/runs/{$this->run->id}/output/summary",
            [],
        )->assertNotFound();
    }
}
