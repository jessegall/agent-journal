<?php

declare(strict_types=1);

namespace App\Web\Creation;

use App\Web\Attributes\Deferred;
use App\Web\Attributes\Live;
use App\Web\Creation\Exceptions\InvalidSurfacePolicy;

final readonly class SurfacePropPolicy
{
    public function __construct(
        string $location,
        public Deferred|null $deferred,
        public bool $isOptional,
        public Live|null $live,
    ) {
        if ($isOptional && $deferred !== null) {
            throw InvalidSurfacePolicy::at($location, 'A prop cannot be both optional and deferred.');
        }

        if ($deferred !== null && trim($deferred->group) === '') {
            throw InvalidSurfacePolicy::at($location, 'A deferred prop must name its group.');
        }
    }
}
