<?php

declare(strict_types=1);

namespace App\Domain\Web\Support;

use App\Core\Contracts\CurrentActor;
use App\Domain\Contracts\VisibilityCheck;
use Illuminate\Contracts\Container\Container;

/**
 * Runs a declaration's visibility checks for the actor of this request, in order, stopping at the first refusal.
 */
final readonly class VisibilityChecks
{
    public function __construct(
        private CurrentActor $actors,
        private Container $container,
    ) {}

    /**
     * @param  list<class-string<VisibilityCheck>>  $checks
     */
    public function allow(array $checks): bool
    {
        $actor = $this->actors->actor();

        return array_all($checks, fn (string $check) => $this->container->make($check)->allows($actor));
    }
}
