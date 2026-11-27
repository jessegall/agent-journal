<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Agents\Drivers\Setup\DriverImageRecipes;
use App\Agents\Drivers\Setup\DriverProfile;
use App\Agents\Drivers\Setup\DriverProfiles;
use App\Hosts\Contracts\HostDriverImages as HostDriverImagesContract;
use App\Models\Projects\DriverImageRecipeRecord;
use App\Models\Projects\Host;
use App\Models\Projects\HostDriverImage;
use App\Models\Projects\HostDriverImageWait;
use App\Models\Sessions\SessionProcess;
use App\Support\AgentImage;

/**
 * A contained host's driver images: each deployed driver's recipe on the host's base, kept once and reserved as the
 * host's one row of it, so drivers that share a recipe share one build.
 */
final readonly class HostDriverImages implements HostDriverImagesContract
{
    public function __construct(
        private DriverProfiles $profiles,
        private DriverImageRecipes $recipes,
        private AgentImage $base,
    ) {}

    public function reserveAll(Host $host): array
    {
        $ids = array_map(fn (DriverProfile $driver) => $this->imageFor($host, $driver)->id, $this->profiles->all());

        foreach (DriverImageRecipeRecord::findFrozenOn($host->id) as $frozen) {
            $ids[] = HostDriverImage::reserve($host, $frozen)->id;
        }

        return array_values(array_unique($ids));
    }

    public function imageFor(Host $host, DriverProfile $driver): HostDriverImage
    {
        $recipe = $this->recipes->of($driver->family(), $driver->image(), $this->base->reference);

        return HostDriverImage::reserve($host, DriverImageRecipeRecord::keep($recipe));
    }

    public function allowSetOf(Host $host): array
    {
        return [$this->base->reference, ...HostDriverImage::resolveAllowedImagesOn($host->id)];
    }

    public function needsAllowSet(Host $host): bool
    {
        return ! $host->allowsImages($this->allowSetOf($host)) || HostDriverImage::hasUnorderedOn($host->id);
    }

    public function awaitFor(HostDriverImage $image, SessionProcess $start): bool
    {
        $locked = HostDriverImage::query()->whereKey($image->id)->lockForUpdate()->firstOrFail();
        HostDriverImageWait::for($locked, $start);

        return $locked->isReady();
    }
}
