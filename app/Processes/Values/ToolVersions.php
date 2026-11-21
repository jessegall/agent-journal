<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Files\Support\CodeFiles;
use JsonException;

/**
 * The versions of the tools a project has installed, by where each is read: 'composer.lock: <package>' and
 * 'package-lock.json: <package>'.
 */
final readonly class ToolVersions
{
    /**
     * @param  array<string, string>  $versions
     */
    public function __construct(private array $versions) {}

    public static function ofProject(string $root): self
    {
        $versions = [];
        $composer = self::lockOf("{$root}/composer.lock");

        foreach ([...($composer['packages'] ?? []), ...($composer['packages-dev'] ?? [])] as $package) {
            $versions["composer.lock: {$package['name']}"] = ltrim((string) $package['version'], 'v');
        }

        $npm = self::lockOf("{$root}/package-lock.json");

        foreach ($npm['packages'] ?? [] as $path => $package) {
            $name = substr((string) $path, strlen('node_modules/'));
            $versions["package-lock.json: {$name}"] = (string) ($package['version'] ?? '');
        }

        return new self($versions);
    }

    /**
     * A lock file of the project, decoded; a missing or broken one is refused by name.
     *
     * @return array<array-key, mixed>
     *
     * @throws JsonException when the lock file is not JSON
     */
    private static function lockOf(string $path): array
    {
        $code = CodeFiles::ofProcess();

        return (array) json_decode($code->file($code->projectPathOf($path)), true, 512, JSON_THROW_ON_ERROR);
    }

    /**
     * Whether the tool read from the source is installed at exactly that version.
     */
    public function hasInstalled(string $source, string $version): bool
    {
        return array_key_exists($source, $this->versions) && $this->versions[$source] === $version;
    }
}
