<?php

declare(strict_types=1);

namespace App\Skills\Values;

/**
 * Where a program discovers a launch's skills, and the arguments its launch adds so it does: typed values, never shell
 * text.
 */
final readonly class SkillDelivery
{
    /**
     * @param  list<string>  $launchArguments
     */
    public function __construct(
        public string $target,
        public array $launchArguments,
    ) {}
}
