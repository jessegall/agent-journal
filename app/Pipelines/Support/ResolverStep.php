<?php

declare(strict_types=1);

namespace App\Pipelines\Support;

use App\Bus\Contracts\Pipable;
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

        return function (object $carried, Closure $next) use ($resolve, $sequence): object {
            /**
             * @var class-string<Pipable> $chosen
             */
            $chosen = $resolve($carried);

            return $sequence([$chosen])($carried, $next);
        };
    }

    public function carriesOn(array $carried, Closure $follow): array
    {
        return ['mixed'];
    }
}
