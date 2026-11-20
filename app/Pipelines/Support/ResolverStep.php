<?php

declare(strict_types=1);

namespace App\Pipelines\Support;

use App\Pipelines\Contracts\Pipable;
use Closure;

/**
 * The pipe or pipeline a resolver names for each value.
 */
final readonly class ResolverStep extends Step
{
    public function __construct(private Closure $resolve) {}

    public function run(Closure $sequence): Closure
    {
        $resolve = $this->resolve;

        return function (object $stepInput) use ($resolve, $sequence): object {
            /**
             * @var class-string<Pipable> $chosen
             */
            $chosen = $resolve($stepInput);

            return $sequence([$chosen])($stepInput);
        };
    }
}
