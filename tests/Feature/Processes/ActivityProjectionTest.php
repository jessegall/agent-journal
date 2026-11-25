<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Enums\Processes\OutputStream;
use App\Events\Processes\RunChanged;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Resolvers\Support\ActivityProjection;
use App\Support\ActorIdentity;
use App\Support\SpoolRecorder;
use App\Values\CapturedChunk;
use App\Values\PartActivity;
use App\Values\PartEnd;
use App\Values\PartKey;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Event;
use Tests\Support\Processes\ProcessOutputDisk;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestRunAdmissions;
use Tests\TestCase;

/**
 * Every part of every run shows its activity without a reader: name, elapsed time, bytes and its latest line, with a
 * draining part shown as finalizing and never a result.
 */
final class ActivityProjectionTest extends TestCase
{
    use RefreshHookDatabase;

    private const string PART_NAME = 'acme verify';

    private const string LATEST_LINE = '\x1B[31mlatest line';

    private PartRun $part;

    protected function setUp(): void
    {
        parent::setUp();

        ProcessOutputDisk::fake();
        Event::fake([RunChanged::class]);
        $run = ProcessRun::create(ActorIdentity::system(), TestRunAdmissions::of());
        $this->part = PartRun::create($run, new PartKey(1, 1, self::PART_NAME));
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

        $this->assertSame(self::PART_NAME, $activity->name);
        $this->assertSame('running', $activity->lifecycle);
        $this->assertSame(['stdout' => 23], $activity->bytes);
        $this->assertSame(self::LATEST_LINE, $activity->latestLine);
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
