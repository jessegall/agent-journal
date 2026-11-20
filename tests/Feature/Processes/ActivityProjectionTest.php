<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Actors\Support\ActorIdentity;
use App\Processes\Enums\OutputStream;
use App\Processes\Events\RunChanged;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Resolvers\Support\ActivityProjection;
use App\Processes\Support\SpoolRecorder;
use App\Processes\Values\CapturedChunk;
use App\Processes\Values\PartActivity;
use App\Processes\Values\PartEnd;
use App\Processes\Values\PartKey;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestRunAdmissions;
use Tests\TestCase;

/**
 * Every part of every run shows its activity without a reader: name, elapsed time, bytes and its latest line, with a
 * draining part shown as finalizing and never a result (doc 21 revision 6, sections 54, 59 and 69; stories 124, 125,
 * 132, 166, 174 and 176).
 */
final class ActivityProjectionTest extends TestCase
{
    use RefreshHookDatabase;

    private PartRun $part;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake(SpoolRecorder::DISK);
        Event::fake([RunChanged::class]);
        $run = ProcessRun::create(ActorIdentity::system(), TestRunAdmissions::of());
        $this->part = PartRun::create($run, new PartKey(1, 1, 'acme verify'));
        $this->part->start('host', 1);
        $bytes = <<<TEXT
        first
        \x1b[31mlatest line

        TEXT;
        $chunk = new CapturedChunk($this->part, OutputStream::Stdout, $bytes, CarbonImmutable::now());
        $this->app->make(SpoolRecorder::class)->append($chunk);
    }

    public function test_a_running_part_shows_its_bytes_and_latest_line_and_nothing_like_a_result(): void
    {
        $activity = $this->activity();

        $this->assertSame('acme verify', $activity->name);
        $this->assertSame('running', $activity->lifecycle);
        $this->assertSame(['stdout' => 23], $activity->bytes);
        $this->assertSame('\x1B[31mlatest line', $activity->latestLine);
        $this->assertGreaterThanOrEqual(0, $activity->elapsedSeconds);
        $this->assertSame(
            ['partRunId', 'name', 'lifecycle', 'elapsedSeconds', 'bytes', 'lastActivityAt', 'latestLine'],
            array_keys(get_object_vars($activity))
        );
        Event::assertDispatched(RunChanged::class);
    }

    public function test_a_draining_part_shows_finalizing_until_its_lifecycle_ends(): void
    {
        $this->part->finishProcess(PartEnd::exited(0));
        $this->assertSame('finalizing', $this->activity()->lifecycle);

        $this->part->finishDraining();
        $this->assertSame('ended', $this->activity()->lifecycle);
    }

    private function activity(): PartActivity
    {
        $run = ProcessRun::query()->withoutGlobalScopes()->findOrFail($this->part->process_run_id);

        return $this->app->make(ActivityProjection::class)->ofRun($run)[0];
    }
}
