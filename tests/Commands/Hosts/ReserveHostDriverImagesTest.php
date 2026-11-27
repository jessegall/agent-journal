<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Exceptions\HostNotContained;
use App\Hosts\Commands\ReserveHostDriverImages\ReserveHostDriverImagesCommand;
use App\Hosts\Enums\DriverImageStatus;
use App\Models\Projects\HostDriverImage;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A contained host keeps one pending row per distinct recipe of the deployed drivers, the same rows however often it
 * is asked, apart from every other host's; a local host builds no driver images.
 */
#[TestsCommand(ReserveHostDriverImagesCommand::class)]
final class ReserveHostDriverImagesTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_each_contained_host_keeps_one_row_per_recipe_however_often_it_is_asked(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()])->enrollContainedHost('Crate', [base_path()]);
        $box = $this->journal->hostCalled('Box')->hostId;
        $crate = $this->journal->hostCalled('Crate')->hostId;

        $first = $this->journal->asSystem(new ReserveHostDriverImagesCommand($box));
        $again = $this->journal->asSystem(new ReserveHostDriverImagesCommand($box));
        $other = $this->journal->asSystem(new ReserveHostDriverImagesCommand($crate));

        $this->journal->assertResult(
            [2, 2, 2, 2, 2, [DriverImageStatus::Pending]],
            [
                $first,
                $again,
                $other,
                HostDriverImage::query()->where('host_id', $box)->count(),
                HostDriverImage::query()->where('host_id', $crate)->count(),
                HostDriverImage::query()->pluck('status')->unique()->values()->all(),
            ],
        );
    }

    public function test_a_local_host_builds_no_driver_images(): void
    {
        $this->journal->enrollHost('Mac', [base_path()]);

        $this->journal->assertRefused(
            HostNotContained::class,
            fn () => $this->journal->asSystem(new ReserveHostDriverImagesCommand($this->journal->hostCalled('Mac')->hostId)),
        );
    }
}
