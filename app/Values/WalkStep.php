<?php

declare(strict_types=1);

namespace App\Values;

/**
 * A path a walk or pattern reached, at its real path, with the levels still left to descend.
 */
final readonly class WalkStep
{
    public function __construct(public FilePath $path, public string $realPath, public int $levels) {}
}
