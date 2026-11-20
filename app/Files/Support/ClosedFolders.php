<?php

declare(strict_types=1);

namespace App\Files\Support;

use App\Files\Enums\Place;
use App\Files\Exceptions\FolderClosed;
use App\Files\Values\FilePath;
use Illuminate\Contracts\Config\Repository;

/**
 * The folders the file funnel never enters: the project's closed folders, and the root of every private place as
 * seen from any other place.
 */
final readonly class ClosedFolders
{
    public function __construct(private Repository $config, private PlaceRoots $roots) {}

    public function assertNotClosed(FilePath $file): void
    {
        foreach ($this->closedIn($file->place) as $folder) {
            if ($file->relative === $folder || str_starts_with($file->relative, "{$folder}/")) {
                throw FolderClosed::at($folder);
            }
        }
    }

    /**
     * The closed folders of a place, each relative to its root.
     *
     * @return list<string>
     */
    public function closedIn(Place $place): array
    {
        $folders = $place === Place::Project ? $this->config->array('files.closed_folders') : [];
        $root = $this->roots->root($place);

        foreach ($this->roots->available() as $other) {
            $otherRoot = $this->roots->root($other);

            if ($other !== $place && $other->isPrivate() && str_starts_with($otherRoot, "{$root}/")) {
                $folders[] = substr($otherRoot, strlen($root) + 1);
            }
        }

        return array_values(array_map(strval(...), $folders));
    }
}
