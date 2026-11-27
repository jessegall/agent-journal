<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup;

/**
 * How a driver's build is probed: the command, the host names it inherits and the line it prints for the pinned build.
 */
final readonly class VersionProbe
{
    /**
     * @param  non-empty-list<string>  $argv
     * @param  list<string>  $inherited
     */
    public function __construct(public array $argv, public array $inherited, public VersionLine $line) {}

    /**
     * Whether the printed output names the build, as the driver's version line reads it.
     */
    public function accepts(string $printed, string $build): bool
    {
        return $this->line->accepts($printed, $build);
    }
}
