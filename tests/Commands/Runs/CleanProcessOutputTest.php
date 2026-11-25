<?php

declare(strict_types=1);

namespace Tests\Commands\Runs;

use App\Commands\Runs\CleanProcessOutput\CleanProcessOutputCommand;
use App\Enums\Runs\CaptureStatus;
use App\Exceptions\CleanRefused;
use App\Models\Runs\OutputChunk;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Support\OutputRecorder;
use Illuminate\Support\Facades\Storage;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedPayloads;
use Tests\TestCase;

/**
 * A preview lists what goes and a clean marks the output removed; a run that has not ended keeps its output.
 */
final class CleanProcessOutputTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsAcmeRequests;
    use SendsSignedPayloads;

    private PartRun $part;

    protected function setUp(): void
    {
        parent::setUp();

        $this->openAcmeRequest();
        $this->part = $this->normalRun(0, self::PASSED_OUTPUT);
    }

    public function test_a_preview_lists_what_goes_and_a_clean_marks_the_output_removed(): void
    {
        $this->storedRun()->markStopped('done');

        $preview = $this->asUser(new CleanProcessOutputCommand([$this->part->process_run_id], true));
        $this->assertSame([$this->part->id], $preview->partRunIds);
        $this->assertSame(strlen(self::PASSED_OUTPUT), $preview->bytes);
        $this->assertSame(CaptureStatus::Complete, $this->part->refresh()->capture_state);

        $this->asUser(new CleanProcessOutputCommand([$this->part->process_run_id], false));

        $this->assertSame(CaptureStatus::Removed, $this->part->refresh()->capture_state);
        $chunk = OutputChunk::query()->where('part_run_id', $this->part->id)->sole();
        Storage::disk(OutputRecorder::DISK)->assertMissing($chunk->storage_path);
    }

    public function test_a_run_that_has_not_ended_keeps_its_output(): void
    {
        $this->assertThrows(
            fn () => $this->asUser(new CleanProcessOutputCommand([$this->part->process_run_id], false)),
            CleanRefused::class,
        );
    }

    private function storedRun(): ProcessRun
    {
        return ProcessRun::query()->withoutGlobalScopes()->findOrFail($this->part->process_run_id);
    }
}
