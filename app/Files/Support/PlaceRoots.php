<?php

declare(strict_types=1);

namespace App\Files\Support;

use App\Files\Enums\Place;
use App\Files\Exceptions\FileOutsidePlaces;
use App\Files\Exceptions\FilePathInvalid;
use App\Files\Exceptions\FolderClosed;
use App\Files\Exceptions\PlaceUnavailable;
use App\Files\Values\FilePath;
use Illuminate\Contracts\Config\Repository;

/**
 * The real root folder of each place, read from its setting when the place is used, so one missing root stops only
 * its own place.
 */
final readonly class PlaceRoots
{
    public function __construct(private Repository $config) {}

    public function root(Place $place): string
    {
        $root = $this->existingRoot($place);

        if ($root === null) {
            throw PlaceUnavailable::for($place);
        }

        return $root;
    }

    /**
     * The places whose root folder exists now.
     *
     * @return list<Place>
     */
    public function available(): array
    {
        return array_values(array_filter(Place::cases(), fn (Place $place) => $this->existingRoot($place) !== null));
    }

    /**
     * The file path of an absolute path given from outside, such as a command's --file, in the open place that holds
     * it; a private place's file is never reached this way.
     */
    public function filePathOf(string $absolutePath): FilePath
    {
        if (str_contains($absolutePath, "\0")) {
            throw FilePathInvalid::nulByte();
        }

        $real = $this->realPathOf($absolutePath);
        $place = $this->innermostPlaceOf($real);

        if ($place->isPrivate()) {
            throw FolderClosed::privatePlace($place);
        }

        return FilePath::in($place, ltrim(substr($real, strlen($this->root($place))), '/'));
    }

    /**
     * Whether a real path is the place's root or lies beneath it.
     */
    public function isWithin(string $real, Place $place): bool
    {
        $root = $this->root($place);

        return $real === $root || str_starts_with($real, rtrim($root, '/').'/');
    }

    /**
     * The place whose root lies closest above a real path, so a private place inside the project is the one found.
     */
    private function innermostPlaceOf(string $real): Place
    {
        $holders = array_filter($this->available(), fn (Place $place) => $this->isWithin($real, $place));

        if ($holders === []) {
            throw FileOutsidePlaces::given();
        }

        usort($holders, fn (Place $one, Place $other) => strlen($this->root($other)) <=> strlen($this->root($one)));

        return $holders[0];
    }

    /**
     * The real path of a path, or of its folder followed by its name when the file does not exist yet.
     */
    private function realPathOf(string $path): string
    {
        $real = realpath($path);

        if ($real !== false) {
            return $real;
        }

        $folder = realpath(dirname($path));

        if ($folder === false) {
            throw FileOutsidePlaces::given();
        }

        return $folder.'/'.basename($path);
    }

    private function existingRoot(Place $place): string|null
    {
        $configured = $this->config->get($place->rootSetting());

        if (! is_string($configured) || $configured === '') {
            return null;
        }

        $real = realpath($configured);

        return $real !== false && is_dir($real) ? $real : null;
    }
}
