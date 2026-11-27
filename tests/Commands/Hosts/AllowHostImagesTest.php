<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\AllowHostImages\AllowHostImagesCommand;
use App\Hosts\Commands\ReserveHostDriverImages\ReserveHostDriverImagesCommand;
use App\Hosts\Protocol\HostInstructionType;
use App\Models\Projects\Host;
use App\Models\Projects\HostDriverImage;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A contained host is ordered to run only the images named, and the journal keeps what it ordered.
 */
#[TestsCommand(AllowHostImagesCommand::class)]
final class AllowHostImagesTest extends TestCase
{
    use RefreshHookDatabase;

    private const string IMAGE = 'registry.example/agent@sha256:aaaa';

    private const string BUILT = 'sha256:2222222222222222222222222222222222222222222222222222222222222222';

    public function test_it_instructs_the_host_to_run_only_these_images_and_keeps_them(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()]);
        $hostId = $this->journal->hostCalled('Box')->hostId;

        $instructionId = $this->journal->asSystem(new AllowHostImagesCommand($hostId, [self::IMAGE]));

        $instruction = $this->journal->hostInstructionsOn('Box')[0];
        $this->journal->assertResult(
            [$instructionId, HostInstructionType::AllowImages, ['images' => [self::IMAGE]], [self::IMAGE]],
            [
                $instruction->id,
                $instruction->type,
                $this->journal->payloadOf($instruction),
                Host::query()->whereKey($hostId)->sole()->allowed_images,
            ],
        );
    }

    public function test_a_set_asked_while_one_is_out_waits_for_its_answer_and_each_built_image_records_the_set(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()]);
        $hostId = $this->journal->hostCalled('Box')->hostId;
        $this->journal->asSystem(new ReserveHostDriverImagesCommand($hostId));
        $image = HostDriverImage::query()->where('host_id', $hostId)->firstOrFail();
        $image->startAttempt('build-1');
        $image->built(self::BUILT);

        $first = $this->journal->asSystem(new AllowHostImagesCommand($hostId, [self::IMAGE, self::BUILT]));
        $second = $this->journal->asSystem(new AllowHostImagesCommand($hostId, [self::IMAGE]));

        $this->journal->assertResult(
            [$first, 1, $first, [self::IMAGE, self::BUILT]],
            [
                $second,
                count($this->journal->hostInstructionsOn('Box')),
                $image->refresh()->allow_instruction_id,
                Host::query()->whereKey($hostId)->sole()->allowed_images,
            ],
        );
    }
}
