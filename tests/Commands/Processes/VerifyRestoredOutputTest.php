<?php

declare(strict_types=1);

namespace Tests\Commands\Processes;

use App\Models\Runs\OutputChunk;
use App\Models\Runs\PartRun;
use App\Processes\Commands\VerifyRestoredOutput\VerifyRestoredOutputCommand;
use App\Processes\Enums\CaptureStatus;
use App\Processes\OutputRecorder;
use Illuminate\Support\Facades\Storage;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Restored output counts only when every byte matches.
 */
#[TestsCommand(VerifyRestoredOutputCommand::class)]
final class VerifyRestoredOutputTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsAcmeRequests;

    private PartRun $part;

    protected function setUp(): void
    {
        parent::setUp();

        $this->openAcmeRequest();
        $this->part = $this->normalRun(0, self::PASSED_OUTPUT);
    }

    public function test_restored_output_counts_only_when_every_byte_matches(): void
    {
        $path = OutputChunk::query()->where('part_run_id', $this->part->id)->sole()->storage_path;
        Storage::disk(OutputRecorder::DISK)->put($path, 'X'.substr(self::PASSED_OUTPUT, 1));

        $check = new VerifyRestoredOutputCommand($this->part->process_run_id);
        $this->assertSame([CaptureStatus::Corrupt], $this->journal->actAsUserId(TestIds::of(7))->runUnkeyed($check)->states());

        Storage::disk(OutputRecorder::DISK)->put($path, self::PASSED_OUTPUT);
        $this->assertSame([CaptureStatus::Complete], $this->journal->actAsUserId(TestIds::of(7))->runUnkeyed($check)->states());
    }
}
