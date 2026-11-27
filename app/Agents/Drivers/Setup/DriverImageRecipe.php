<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup;

use App\Exceptions\DriverImageRecipeInvalid;
use App\Support\TarArchive;
use App\Support\TarFile;

/**
 * What a host builds a driver image from: the regular files of the driver's image folder as one canonical tar, the
 * base it builds on and the version it installs. Its digest names exactly these inputs, so two hosts with the same
 * recipe build the same image, and a kept recipe is rebuilt from its own bytes, never from the deploy again.
 */
final readonly class DriverImageRecipe
{
    /**
     * The longest path a tar entry's name field holds.
     */
    public const int PATH_LIMIT = 100;

    private function __construct(
        public string $folder,
        public string $base,
        public string $version,
        public string $context,
        public string $digest,
    ) {}

    /**
     * The recipe of the folder's files, given as their paths inside the folder with their contents, sorted by path so
     * the same files always give the same recipe.
     *
     * @param  array<string, string>  $files  each file's path inside the folder and its content
     *
     * @throws DriverImageRecipeInvalid for a path that is absolute, climbs out with .., or is too long for a tar entry
     */
    public static function of(string $folder, array $files, string $base, string $version): self
    {
        ksort($files, SORT_STRING);

        foreach (array_keys($files) as $path) {
            self::assertPlain((string) $path);
        }

        $entries = array_map(
            fn (string $path, string $content) => TarFile::shared($path, $content),
            array_map(strval(...), array_keys($files)),
            $files,
        );

        return new self($folder, $base, $version, TarArchive::of(...$entries), self::digestOf($files, $base, $version));
    }

    /**
     * The recipe as it was kept: its own tar bytes and digest, read back without the deploy's files.
     */
    public static function kept(string $folder, string $base, string $version, string $context, string $digest): self
    {
        return new self($folder, $base, $version, $context, $digest);
    }

    /**
     * @throws DriverImageRecipeInvalid
     */
    private static function assertPlain(string $path): void
    {
        $isOutside = str_starts_with($path, '/') || in_array('..', explode('/', $path), true);

        if ($isOutside || $path === '' || strlen($path) > self::PATH_LIMIT) {
            throw DriverImageRecipeInvalid::path($path);
        }
    }

    /**
     * Each file framed by the lengths of its path and content, then the base and the version, so no two different
     * recipes run together into the same bytes.
     *
     * @param  array<string, string>  $files
     */
    private static function digestOf(array $files, string $base, string $version): string
    {
        $context = hash_init('sha256');

        foreach ($files as $path => $content) {
            hash_update($context, self::framed((string) $path).self::framed($content));
        }

        hash_update($context, self::framed($base).self::framed($version));

        return hash_final($context);
    }

    private static function framed(string $part): string
    {
        return strlen($part).':'.$part;
    }
}
