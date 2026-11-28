<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup;

use App\Agents\Drivers\Contracts\PinnedBuilds;
use App\Exceptions\DriverImageRecipeInvalid;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Files\Values\Depth;
use App\Values\FilePath;

/**
 * Reads a driver's image folder of the deploy into its recipe, once: every regular file under its path inside the
 * folder, on the base the host builds on, at the version the folder pins.
 */
final readonly class DriverImageRecipes
{
    public function __construct(private Files $files, private PinnedBuilds $builds) {}

    /**
     * @throws DriverImageRecipeInvalid for a link in the folder or a path no recipe may carry
     */
    public function of(DriverImage $image, string $base): DriverImageRecipe
    {
        $folder = FilePath::in(Place::Project, $image->folder);
        $files = [];

        foreach ($this->files->list($folder, Depth::levels(Depth::LEVEL_LIMIT)) as $entry) {
            $path = substr($entry->path->relative, strlen($folder->relative) + 1);

            if ($this->files->isLink($entry->path)) {
                throw DriverImageRecipeInvalid::link($path);
            }

            if ($entry->isFile()) {
                $files[$path] = $this->files->read($entry->path);
            }
        }

        return DriverImageRecipe::of($image->folder, $files, $base, $this->builds->versionOf($image->family()));
    }
}
