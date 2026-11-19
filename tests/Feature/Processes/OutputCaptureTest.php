<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Actors\Support\ActorIdentity;
use App\Processes\Enums\CaptureState;
use App\Processes\Enums\OutputStream;
use App\Processes\Exceptions\OutputStorageFailed;
use App\Processes\Execution\SpawnedProcess;
use App\Processes\Models\OutputChunk;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\ManifestCheck;
use App\Processes\Support\SpoolRecorder;
use App\Processes\Values\CapturedChunk;
use App\Processes\Values\PartEnd;
use App\Processes\Values\PartKey;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Storage;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestRunAdmissions;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Every byte a part writes is stored from byte zero on the private process-output disk, and the manifest tells a
 * complete capture from a gap (doc 21 revision 6, section 54).
 */
final class OutputCaptureTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake(SpoolRecorder::DISK);
    }

    #[TimeLimit(20, 'It pipes 50 MiB from a child process through the recorder.')]
    public function test_a_part_writing_50_mib_keeps_every_byte(): void
    {
        $part = $this->part();
        $recorder = $this->app->make(SpoolRecorder::class);
        $process = SpawnedProcess::start(['head', '-c', '52428800', '/dev/zero'], [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], sys_get_temp_dir(), ['PATH' => (string) getenv('PATH')]);
        $this->assertInstanceOf(SpawnedProcess::class, $process);

        $process->drain(fn (OutputStream $stream, string $bytes) => $recorder->append(new CapturedChunk($part, $stream, $bytes, CarbonImmutable::now())));
        $recorder->finish($part, $process->wait());

        $this->assertSame(52_428_800, $part->refresh()->stream_offsets['stdout']);
        $this->assertSame(CaptureState::Complete, $part->capture_state);
    }

    public function test_binary_bytes_and_carriage_returns_are_stored_raw(): void
    {
        $part = $this->part();
        $bytes = "\x00\xffprogress 10%\rprogress 20%\r\n";

        $this->app->make(SpoolRecorder::class)->append(new CapturedChunk($part, OutputStream::Stdout, $bytes, CarbonImmutable::now()));

        $chunk = OutputChunk::query()->where('part_run_id', $part->id)->firstOrFail();
        $this->assertSame($bytes, Storage::disk(SpoolRecorder::DISK)->get($chunk->storage_path));
    }

    public function test_a_removed_chunk_file_is_a_gap_in_the_manifest(): void
    {
        $part = $this->part();
        $recorder = $this->app->make(SpoolRecorder::class);
        $recorder->append(new CapturedChunk($part, OutputStream::Stdout, 'first ', CarbonImmutable::now()));
        $recorder->append(new CapturedChunk($part, OutputStream::Stdout, 'second', CarbonImmutable::now()));

        Storage::disk(SpoolRecorder::DISK)->delete(OutputChunk::query()->where('part_run_id', $part->id)->where('offset', 0)->firstOrFail()->storage_path);

        $this->assertSame(CaptureState::Incomplete, $this->app->make(ManifestCheck::class)->stateOf($part->refresh()));
    }

    #[TimeLimit(5, 'It waits out a short drain deadline while a background child holds the pipe.')]
    public function test_a_background_child_holding_stdout_past_the_deadline_leaves_the_drain_unfinished(): void
    {
        $process = SpawnedProcess::start(['sh', '-c', 'sleep 3 & echo started'], [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], sys_get_temp_dir(), ['PATH' => (string) getenv('PATH')]);
        $this->assertInstanceOf(SpawnedProcess::class, $process);

        $drained = $process->drain(fn () => null, 0.5);

        $this->assertFalse($drained);
        $this->assertSame(0, $process->wait()->code);
    }

    public function test_a_failed_write_stops_with_storage_failed(): void
    {
        $part = $this->part();
        $occupied = "{$part->process_run_id}/{$part->id}/stdout/".str_pad('0', 20, '0', STR_PAD_LEFT).'.chunk';
        Storage::disk(SpoolRecorder::DISK)->put($occupied, 'already here');

        $this->expectException(OutputStorageFailed::class);

        $this->app->make(SpoolRecorder::class)->append(new CapturedChunk($part, OutputStream::Stdout, 'bytes', CarbonImmutable::now()));
    }

    public function test_the_output_disk_is_private_and_never_served(): void
    {
        $this->assertSame('private', config('filesystems.disks.process-output.visibility'));
        $this->assertFalse(config('filesystems.disks.process-output.serve'));
        $this->assertStringNotContainsString('public', (string) config('filesystems.disks.process-output.root'));
    }

    private function part(): PartRun
    {
        $run = ProcessRun::admit(ActorIdentity::system(), TestRunAdmissions::of());
        $part = PartRun::queue($run, new PartKey(1, 1, 'head'));
        $part->start(1, 'host');
        $part->finishProcess(PartEnd::exited(0));

        return $part;
    }
}
