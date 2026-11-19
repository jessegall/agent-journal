<?php

declare(strict_types=1);

namespace App\Processes\Values;

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
        $composer = json_decode((string) @file_get_contents("{$root}/composer.lock"), true);

        foreach ([...($composer['packages'] ?? []), ...($composer['packages-dev'] ?? [])] as $package) {
            $versions["composer.lock: {$package['name']}"] = ltrim((string) $package['version'], 'v');
        }

        $npm = json_decode((string) @file_get_contents("{$root}/package-lock.json"), true);

        foreach ($npm['packages'] ?? [] as $path => $package) {
            $name = substr((string) $path, strlen('node_modules/'));
            $versions["package-lock.json: {$name}"] = (string) ($package['version'] ?? '');
        }

        return new self($versions);
    }

    /**
     * Whether the tool read from the source is installed at exactly that version.
     */
    public function hasInstalled(string $source, string $version): bool
    {
        return array_key_exists($source, $this->versions) && $this->versions[$source] === $version;
    }
}
