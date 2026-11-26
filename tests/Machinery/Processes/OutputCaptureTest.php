<?php

declare(strict_types=1);

namespace Tests\Machinery\Processes;

use App\Enums\Processes\OutputStream;
use App\Enums\Runs\CaptureStatus;
use App\Exceptions\OutputStorageFailed;
use App\Models\Runs\OutputChunk;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Support\ActorReference;
use App\Support\Execution\SpawnedProcess;
use App\Support\ManifestCheck;
use App\Support\OutputRecorder;
use App\Values\CapturedChunk;
use App\Values\PartEnd;
use App\Values\PartKey;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Storage;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Processes\ProcessOutputDisk;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestRunAdmissions;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Every byte a part writes is stored from byte zero on the private process-output disk, and the manifest tells a
 * complete capture from a gap.
 */
#[TestsMachinery(OutputRecorder::class)]
final class OutputCaptureTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        ProcessOutputDisk::fake();
    }

    public function test_a_removed_chunk_file_is_a_gap_in_the_manifest(): void
    {
        $part = $this->part();
        $recorder = $this->app->make(OutputRecorder::class);
        $recorder->append(new CapturedChunk($part, OutputStream::Stdout, 'first ', CarbonImmutable::now()));
        $recorder->append(new CapturedChunk($part, OutputStream::Stdout, 'second', CarbonImmutable::now()));

        Storage::disk(OutputRecorder::DISK)->delete(
            OutputChunk::query()->where('part_run_id', $part->id)->where('offset', 0)->firstOrFail()->storage_path,
        );

        $this->assertSame(CaptureStatus::Incomplete, $this->app->make(ManifestCheck::class)->stateOf($part->refresh()));
    }

    public function test_a_failed_write_stops_with_storage_failed(): void
    {
        $part = $this->part();
        $occupied = "{$part->process_run_id}/{$part->id}/stdout/".str_pad('0', 20, '0', STR_PAD_LEFT).'.chunk';
        Storage::disk(OutputRecorder::DISK)->put($occupied, 'already here');

        $this->expectException(OutputStorageFailed::class);

        $this->app->make(OutputRecorder::class)->append(
            new CapturedChunk($part, OutputStream::Stdout, 'bytes', CarbonImmutable::now()),
        );
    }

    #[TimeLimit(5, 'It waits out a short drain deadline while a background child holds the pipe.')]
    public function test_a_background_child_holding_stdout_past_the_deadline_leaves_the_drain_unfinished(): void
    {
        $process = SpawnedProcess::start(
            ['sh', '-c', 'sleep 3 & echo started'],
            [1 => ['pipe', 'w'], 2 => ['pipe', 'w']],
            sys_get_temp_dir(),
            ['PATH' => (string) getenv('PATH')],
        );
        $this->assertInstanceOf(SpawnedProcess::class, $process);

        $drained = $process->drain(fn () => null, 0.5);

        $this->assertFalse($drained);
        $this->assertSame(0, $process->wait()->code);
    }

    public function test_the_output_disk_is_private_and_never_served(): void
    {
        $this->assertSame('private', config('filesystems.disks.process-output.visibility'));
        $this->assertFalse(config('filesystems.disks.process-output.serve'));
        $this->assertStringNotContainsString('public', (string) config('filesystems.disks.process-output.root'));
    }

    private function part(): PartRun
    {
        $run = ProcessRun::create(ActorReference::system(), TestRunAdmissions::of());
        $part = PartRun::create($run, new PartKey(1, 1, 'head'));
        $part->start('host', 1);
        $part->finishProcess(PartEnd::exited(0));

        return $part;
    }
}
