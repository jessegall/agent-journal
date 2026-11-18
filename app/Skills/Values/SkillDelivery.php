<?php

declare(strict_types=1);

namespace App\Skills\Values;

/**
 * Where a program discovers a launch's skills, the arguments its launch adds so it does, and the links its isolated
 * settings folder needs: typed values, never shell text.
 */
final readonly class SkillDelivery
{
    /**
     * @param  list<string>  $launchArguments
     * @param  array<string, string>  $settingsLinks  the target each link in the launch's settings folder points at, by
     *                                                link name
     */
    public function __construct(
        public string $target,
        public array $launchArguments,
        public array $settingsLinks,
    ) {}
}
