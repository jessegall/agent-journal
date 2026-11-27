<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\BuildHostDriverImage\BuildHostDriverImageCommand;
use App\Hosts\Commands\RecordDriverImageRefusal\RecordDriverImageRefusalCommand;
use App\Hosts\Commands\ReserveHostDriverImages\ReserveHostDriverImagesCommand;
use App\Hosts\Enums\DriverImageStatus;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostRefusal;
use App\Models\Hosts\HostInstruction;
use App\Models\Projects\HostDriverImage;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestHostInstruction;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A refused build settles its driver image by the refusal's kind: an interruption or a daemon out of reach builds it
 * again, three in a row refuse it, and another digest under its name or an unsafe answer refuses it at once.
 */
#[TestsCommand(RecordDriverImageRefusalCommand::class)]
final class RecordDriverImageRefusalTest extends TestCase
{
    use RefreshHookDatabase;

    private HostDriverImage $image;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->enrollContainedHost('Box', [base_path()]);
        $hostId = $this->journal->hostCalled('Box')->hostId;
        $this->journal->asSystem(new ReserveHostDriverImagesCommand($hostId));
        $this->image = HostDriverImage::query()->where('host_id', $hostId)->orderBy('id')->firstOrFail();
    }

    public function test_three_interrupted_builds_in_a_row_refuse_the_image(): void
    {
        $statuses = [];

        foreach ([HostRefusal::HostRestarted, HostRefusal::Expired, HostRefusal::HostRestarted] as $refusal) {
            $this->refuseBuild(fn (TestHostInstruction $build) => $build->refuse($refusal));
            $statuses[] = $this->image->refresh()->status;
        }

        $this->journal->assertResult(
            [DriverImageStatus::Pending, DriverImageStatus::Pending, DriverImageStatus::Refused],
            $statuses,
        );
    }

    public function test_a_daemon_out_of_reach_builds_the_image_again(): void
    {
        $this->refuseBuild(fn (TestHostInstruction $build) => $build->refuseWith(HostRefusal::ImageFault, [
            'fault' => 'daemon_unavailable',
            'reference' => 'journal-driver-claude-code:000000000000',
        ]));

        $this->journal->assertResult(
            [DriverImageStatus::Pending, 1],
            [$this->image->refresh()->status, $this->image->failures],
        );
    }

    public function test_another_digest_under_the_name_or_an_unsafe_answer_refuses_the_image_at_once(): void
    {
        $this->refuseBuild(fn (TestHostInstruction $build) => $build->refuseWith(HostRefusal::ImageFault, [
            'fault' => 'digest_mismatch',
            'reference' => 'journal-driver-claude-code:000000000000',
        ]));

        $this->journal->assertResult(DriverImageStatus::Refused, $this->image->refresh()->status);
    }

    /**
     * @param  \Closure(TestHostInstruction): mixed  $refusal
     */
    private function refuseBuild(\Closure $refusal): void
    {
        $this->journal->asSystem(new BuildHostDriverImageCommand($this->image->host_id, $this->image->id));
        $builds = array_filter(
            $this->journal->hostInstructionsOn('Box'),
            fn (HostInstruction $made) => $made->type === HostInstructionType::BuildImage,
        );
        $this->journal->hostInstruction(end($builds) ?: $this->fail('no build was placed'), $refusal);
    }
}
