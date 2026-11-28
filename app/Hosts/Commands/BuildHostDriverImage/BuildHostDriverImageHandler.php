<?php

declare(strict_types=1);

namespace App\Hosts\Commands\BuildHostDriverImage;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostImageBuildPayload;
use App\Models\Projects\DriverImageRecipeRecord;
use App\Models\Projects\Host;
use App\Models\Projects\HostDriverImage;
use App\Values\HostInstructionSource;

final readonly class BuildHostDriverImageHandler implements CommandHandler
{
    /**
     * The longest a build may run before the host gives it up.
     */
    private const int BUILD_TIME_LIMIT_MS = 1_800_000;

    /**
     * The most of the build's output that comes back.
     */
    private const int OUTPUT_LIMIT = 65_536;

    public function __construct(private HostInstructions $instructions) {}

    /**
     * The row's id: a row that is not pending is left as it is.
     */
    public function handle(BuildHostDriverImageCommand $command): string
    {
        Host::findLocked($command->hostId);
        $image = HostDriverImage::findLocked($command->hostDriverImageId);

        if (! $image->isPending()) {
            return $image->id;
        }

        $recipe = DriverImageRecipeRecord::query()->findOrFail($image->driver_image_recipe_id)->recipe;

        $instruction = $this->instructions->buildImage(
            $command->hostId,
            HostInstructionSource::keyed("driver-image:{$image->id}:".($image->attempt + 1)),
            HostImageBuildPayload::from([
                'name' => 'journal-driver-'.basename($recipe->folder).':'.substr($recipe->digest, 0, 12),
                'base' => $recipe->base,
                'context' => base64_encode($recipe->context),
                'dockerfile' => 'Dockerfile',
                'build_arguments' => [['name' => 'VERSION', 'value' => $recipe->version]],
                'deadline_ms' => self::BUILD_TIME_LIMIT_MS,
                'output_limit' => self::OUTPUT_LIMIT,
            ]),
        );

        $image->startAttempt($instruction->getKey());

        return $image->id;
    }
}
