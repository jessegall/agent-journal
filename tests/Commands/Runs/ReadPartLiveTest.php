<?php

declare(strict_types=1);

namespace Tests\Commands\Runs;

use App\Models\Runs\PartRun;
use App\Models\Runs\ReaderPosition;
use App\Processes\Commands\ReadPartLive\ReadPartLiveCommand;
use App\Processes\Enums\InterpretationStatus;
use App\Processes\Enums\PositionPurpose;
use App\Processes\Resolvers\Support\ActivityProjection;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Processes\StartsWithApprovedAcmePair;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A part is read live into a provisional position, and an oversized record fails the reader alone while capture goes
 * on.
 */
#[TestsCommand(ReadPartLiveCommand::class)]
final class ReadPartLiveTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsWithApprovedAcmePair;

    public function test_a_part_is_read_live_into_a_provisional_position(): void
    {
        $part = $this->normalRun(0, self::PASSED_OUTPUT);

        $position = $this->livePosition($part);
        $this->assertSame(InterpretationStatus::Provisional, $position->interpretation);
        $this->assertSame(['stdout' => strlen(self::PASSED_OUTPUT)], $position->checkpoint->offsets);
    }

    public function test_an_oversized_record_fails_the_reader_alone_and_capture_goes_on(): void
    {
        $part = $this->normalRun(0, str_repeat('x', 70_000)."\n".self::PASSED_OUTPUT);

        $this->assertSame(InterpretationStatus::ReaderFailed, $this->livePosition($part)->interpretation);
        $activity = $this->app->make(ActivityProjection::class)->ofPart($part->refresh());
        $this->assertSame(70_001 + strlen(self::PASSED_OUTPUT), $activity->bytes['stdout']);
    }

    private function livePosition(PartRun $part): ReaderPosition
    {
        return ReaderPosition::query()
            ->where('part_run_id', $part->id)
            ->where('purpose', PositionPurpose::Live->value)
            ->sole();
    }
}
