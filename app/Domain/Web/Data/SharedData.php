<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

/**
 * What every page receives beside its own page object: the application name and, once signed in, the viewer.
 */
final class SharedData extends Data
{
    public function __construct(
        public readonly string $name,
        public readonly ViewerData|Optional $viewer = new Optional,
    ) {}
}
