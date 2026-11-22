<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Place;
use App\Exceptions\FileOutsidePlaces;
use App\Exceptions\FilePathInvalid;
use App\Exceptions\FolderClosed;
use App\Exceptions\PlaceUnavailable;
use App\Values\FilePath;
use Illuminate\Contracts\Config\Repository;
use SensitiveParameter;

/**
 * The real root folder of each place, read from its setting when the place is used, so one missing root stops only
 * its own place.
 */
final readonly class PlaceRoots
{
    public function __construct(private Repository $config) {}

    /**
     * The real root of the place; a missing root is made with the place's mode when it can be, and only a root that
     * is not configured or cannot be made is unavailable.
     */
    public function root(Place $place): string
    {
        $root = $this->existingRoot($place) ?? $this->madeRoot($place);

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
     * The file path of an absolute path in a place the caller names, a private one included, as an account folder
     * handed over by its owner; FileOutsidePlaces when the path does not lie in that place.
     */
    public function pathIn(Place $place, #[SensitiveParameter] string $absolutePath): FilePath
    {
        $root = $this->root($place);
        $real = $this->realPathOf($absolutePath);

        if (! $this->isWithin($real, $place)) {
            throw FileOutsidePlaces::given();
        }

        return FilePath::in($place, ltrim(substr($real, strlen($root)), '/'));
    }

    /**
     * The file path of an absolute path given from outside, such as a command's --file, in the open place that holds
     * it; a private place's file is never reached this way.
     */
    public function filePathOf(#[SensitiveParameter] string $absolutePath): FilePath
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
    public function isWithin(#[SensitiveParameter] string $real, Place $place): bool
    {
        $root = $this->root($place);

        return $real === $root || str_starts_with($real, rtrim($root, '/').'/');
    }

    /**
     * The place whose root lies closest above a real path, so a private place inside the project is the one found.
     */
    private function innermostPlaceOf(#[SensitiveParameter] string $real): Place
    {
        $holders = array_filter($this->available(), fn (Place $place) => $this->isWithin($real, $place));

        if ($holders === []) {
            throw FileOutsidePlaces::given();
        }

        usort($holders, fn (Place $one, Place $other) => strlen($this->root($other)) <=> strlen($this->root($one)));

        return $holders[0];
    }

    /**
     * The real path of a path; for a path not there yet, the real path of its nearest existing folder followed by the
     * names below it, none of which may climb.
     */
    private function realPathOf(#[SensitiveParameter] string $path): string
    {
        $existing = $path;
        $missing = [];

        while (realpath($existing) === false) {
            $name = basename($existing);

            if ($name === '..' || $existing === dirname($existing)) {
                throw FileOutsidePlaces::given();
            }

            array_unshift($missing, $name);
            $existing = dirname($existing);
        }

        return rtrim((string) realpath($existing).'/'.implode('/', $missing), '/');
    }

    /**
     * The configured root, made now with the place's mode; none when it is not configured or cannot be made.
     */
    private function madeRoot(Place $place): string|null
    {
        $configured = $this->config->get($place->rootSetting());

        if (! is_string($configured) || $configured === '' || ! @mkdir($configured, $place->folderMode(), true)) {
            return null;
        }

        return $this->existingRoot($place);
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
