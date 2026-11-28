<?php

declare(strict_types=1);

namespace App\CommandRules\Values;

use App\CommandRules\Data\Images\LockFileData;
use App\Support\ProjectCode;
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

        foreach ([
            ...$composer->packages,
            ...$composer->developmentPackages,
        ] as $package) {
            $versions["composer.lock: {$package->name}"] = ltrim($package->version, 'v');
        }

        foreach (self::lockOf("{$root}/package-lock.json")->packages as $path => $package) {
            $versions['package-lock.json: '.substr((string) $path, strlen('node_modules/'))] = $package->version;
        }

        return new self($versions);
    }

    /**
     * A lock file of the project, decoded; a missing or broken one is refused by name.
     *
     * @throws JsonException when the lock file is not JSON
     */
    private static function lockOf(string $path): LockFileData
    {
        $code = ProjectCode::ofProcess();
        $text = $code->file($code->projectPathOf($path));

        return LockFileData::from(json_decode($text, true, 512, JSON_THROW_ON_ERROR));
    }

    /**
     * Whether the tool read from the source is installed at exactly that version.
     */
    public function hasInstalled(string $source, string $version): bool
    {
        return array_key_exists($source, $this->versions) && $this->versions[$source] === $version;
    }
}
