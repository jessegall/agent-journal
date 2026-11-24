<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Commands\Runs\CleanProcessOutput\CleanProcessOutputCommand;
use App\Commands\Runs\VerifyRestoredOutput\VerifyRestoredOutputCommand;
use App\Contracts\Admission\ShellAdmission;
use App\Enums\AdmissionRefusalCode;
use App\Enums\CaptureState;
use App\Enums\ShellDialect;
use App\Exceptions\CleanRefused;
use App\Models\Runs\OutputChunk;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Support\SpoolRecorder;
use App\Values\Admission;
use App\Values\AdmissionRefusal;
use App\Values\ExecutionContext;
use Illuminate\Support\Facades\Storage;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedCalls;
use Tests\TestCase;

/**
 * Stored output is removed only on a user's explicit clean of ended runs, after a preview; restored files count only
 * when every byte matches; a full output disk starts nothing.
 */
final class OutputCleanupTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsAcmeRequests;
    use SendsSignedCalls;

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
        $this->assertSame(CaptureState::Complete, $this->part->refresh()->capture_state);

        $this->asUser(new CleanProcessOutputCommand([$this->part->process_run_id], false));

        $this->assertSame(CaptureState::Removed, $this->part->refresh()->capture_state);
        $chunk = OutputChunk::query()->where('part_run_id', $this->part->id)->sole();
        Storage::disk(SpoolRecorder::DISK)->assertMissing($chunk->storage_path);
    }

    public function test_a_run_that_has_not_ended_keeps_its_output(): void
    {
        $this->assertThrows(
            fn () => $this->asUser(new CleanProcessOutputCommand([$this->part->process_run_id], false)),
            CleanRefused::class,
        );
    }

    public function test_restored_output_counts_only_when_every_byte_matches(): void
    {
        $path = OutputChunk::query()->where('part_run_id', $this->part->id)->sole()->storage_path;
        Storage::disk(SpoolRecorder::DISK)->put($path, 'X'.substr(self::PASSED_OUTPUT, 1));

        $check = new VerifyRestoredOutputCommand($this->part->process_run_id);
        $this->assertSame([CaptureState::Corrupt], $this->asUser($check)->states());

        Storage::disk(SpoolRecorder::DISK)->put($path, self::PASSED_OUTPUT);
        $this->assertSame([CaptureState::Complete], $this->asUser($check)->states());
    }

    public function test_a_full_output_disk_starts_nothing_until_room_returns(): void
    {
        config(['processes.runner' => true, 'processes.minimum_free_bytes' => PHP_INT_MAX]);
        $full = $this->admitCat('key-1')->decision;
        $this->assertInstanceOf(AdmissionRefusal::class, $full);
        $this->assertSame(AdmissionRefusalCode::RunnerUnavailable, $full->code);

        config(['processes.minimum_free_bytes' => 0]);
        $this->assertTrue($this->admitCat('key-2')->isAllowed());
    }

    private function admitCat(string $key): Admission
    {
        $this->start->startRequest($this->app);

        return $this->app->make(ShellAdmission::class)
            ->admit('cat composer.json', ShellDialect::Bash, ExecutionContext::inFolder(base_path()), $key);
    }

    private function storedRun(): ProcessRun
    {
        return ProcessRun::query()->withoutGlobalScopes()->findOrFail($this->part->process_run_id);
    }
}
