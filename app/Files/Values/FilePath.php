<?php

declare(strict_types=1);

namespace App\Files\Values;

use App\Files\Enums\Place;
use App\Files\Exceptions\FilePathInvalid;
use App\Files\Exceptions\FolderClosed;
use App\Files\Support\PlaceRoots;

/**
 * A place and a path inside it, the only path the file funnel accepts; two paths naming the same file are equal.
 */
final readonly class FilePath
{
    private function __construct(public Place $place, public string $relative) {}

    public static function in(Place $place, string $relative): self
    {
        if (str_contains($relative, "\0")) {
            throw FilePathInvalid::nulByte();
        }

        $segments = explode('/', $relative);

        if (str_starts_with($relative, '/') || in_array('..', $segments, true)) {
            throw FilePathInvalid::climbs($relative);
        }

        $named = array_filter($segments, fn (string $segment) => $segment !== '' && $segment !== '.');

        return new self($place, implode('/', $named));
    }

    /**
     * The open place holding an absolute path given from outside, such as a command's --file; a private place's
     * file is never reached this way.
     */
    public static function ofAbsolute(string $path, PlaceRoots $roots): self
    {
        if (str_contains($path, "\0")) {
            throw FilePathInvalid::nulByte();
        }

        $real = $roots->realPathOf($path);
        $place = $roots->innermostPlaceOf($real);

        if ($place->isPrivate()) {
            throw FolderClosed::privatePlace($place);
        }

        return self::in($place, ltrim(substr($real, strlen($roots->root($place))), '/'));
    }

    public function child(string $name): self
    {
        return self::in($this->place, $this->relative === '' ? $name : "{$this->relative}/{$name}");
    }

    /**
     * The path as a message names it: the relative path and its place, never the folder on the host.
     */
    public function label(): string
    {
        return "{$this->relative} in the place {$this->place->value}";
    }
}
