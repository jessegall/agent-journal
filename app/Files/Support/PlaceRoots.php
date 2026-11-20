<?php

declare(strict_types=1);

namespace App\Files\Support;

use App\Files\Enums\Place;
use App\Files\Exceptions\FileOutsidePlaces;
use App\Files\Exceptions\PlaceUnavailable;
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

        if ($root === false) {
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
        return array_values(array_filter(Place::cases(), fn (Place $place) => $this->existingRoot($place) !== false));
    }

    /**
     * The place whose root lies closest above a real path, so a private place inside the project is the one found.
     */
    public function innermostPlaceOf(string $real): Place
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
    public function realPathOf(string $path): string
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

    /**
     * Whether a real path is the place's root or lies beneath it.
     */
    public function isWithin(string $real, Place $place): bool
    {
        $root = $this->root($place);

        return $real === $root || str_starts_with($real, rtrim($root, '/').'/');
    }

    private function existingRoot(Place $place): string|false
    {
        $configured = $this->config->get($place->rootSetting());

        if (! is_string($configured) || $configured === '') {
            return false;
        }

        $real = realpath($configured);

        return $real !== false && is_dir($real) ? $real : false;
    }
}
