<?php

declare(strict_types=1);

namespace App\Support\Compatibility;

use App\Agents\Drivers\Contracts\PinnedBuilds as PinnedBuildsContract;
use App\Agents\Drivers\DefaultDrivers;
use App\Exceptions\DriverFamilyUnknown;
use App\Exceptions\DriverVersionUnreadable;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Values\FilePath;

/**
 * The pinned build of each driver, as the VERSION file of its image recipe folder under .docker/drivers names it: the
 * one place a driver's version is written.
 */
final readonly class PinnedBuilds implements PinnedBuildsContract
{
    private const string RECIPES = '.docker/drivers';

    public function __construct(private Files $files) {}

    /**
     * @throws DriverFamilyUnknown for a family no recipe folder is kept for
     * @throws DriverVersionUnreadable for a missing or empty VERSION file
     */
    public function versionOf(string $driver): string
    {
        if (! in_array($driver, DefaultDrivers::familyKeys(), true)) {
            throw DriverFamilyUnknown::for($driver);
        }

        $file = FilePath::in(Place::Project, self::RECIPES."/{$driver}/VERSION");

        if (! $this->files->exists($file)) {
            throw DriverVersionUnreadable::missing($file->relative);
        }

        $version = trim($this->files->read($file));

        if (preg_match('/^\d+\.\d+\.\d+$/', $version) === 1) {
            return $version;
        }

        throw DriverVersionUnreadable::invalid($file->relative, $version);
    }
}
