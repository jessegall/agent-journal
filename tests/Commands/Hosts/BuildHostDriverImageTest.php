<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\BuildHostDriverImage\BuildHostDriverImageCommand;
use App\Hosts\Commands\ReserveHostDriverImages\ReserveHostDriverImagesCommand;
use App\Hosts\Enums\DriverImageStatus;
use App\Hosts\Protocol\HostInstructionType;
use App\Models\Projects\DriverImageRecipeRecord;
use App\Models\Projects\HostDriverImage;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A pending driver image goes to its host as one signed build of the recipe's kept inputs: named for its driver and
 * recipe, the kept tar as it was, the pinned version as an argument. A row that is no longer pending is sent nothing.
 */
#[TestsCommand(BuildHostDriverImageCommand::class)]
final class BuildHostDriverImageTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_pending_image_is_built_once_from_its_kept_recipe(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()]);
        $box = $this->journal->hostCalled('Box')->hostId;
        $this->journal->asSystem(new ReserveHostDriverImagesCommand($box));
        $image = HostDriverImage::query()->where('host_id', $box)->firstOrFail();
        $recipe = DriverImageRecipeRecord::query()->findOrFail($image->driver_image_recipe_id)->inputs();

        $this->journal->asSystem(new BuildHostDriverImageCommand($box, $image->id));
        $this->journal->asSystem(new BuildHostDriverImageCommand($box, $image->id));

        $builds = array_values(array_filter(
            $this->journal->hostInstructionsOn('Box'),
            fn ($instruction) => $instruction->type === HostInstructionType::BuildImage,
        ));
        $payload = $this->journal->payloadOf($builds[0]);
        $image->refresh();
        $this->journal->assertResult(
            [
                1,
                'journal-driver-'.basename($recipe->folder).':'.substr($recipe->digest, 0, 12),
                $recipe->context,
                [['name' => 'VERSION', 'value' => $recipe->version]],
                [DriverImageStatus::Building, 1, $builds[0]->id],
            ],
            [
                count($builds),
                $payload['name'],
                base64_decode($payload['context'], true),
                $payload['build_arguments'],
                [$image->status, $image->attempt, $image->build_instruction_id],
            ],
        );
    }
}
