<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\Pipable;
use Closure;
use Illuminate\Container\Attributes\Scoped;

/**
 * The pipes and pipelines the pipeline runner built during the request in hand, each built once and kept until the
 * request ends, so a pipe may take services that hold that request.
 */
#[Scoped]
final class BuiltSteps
{
    /**
     * @var array<class-string<Pipable>, Closure(object): object>
     */
    private array $steps = [];

    /**
     * The step built for the class in this request, built now when it is the first time.
     *
     * @param  class-string<Pipable>  $class
     * @param  Closure(): (Closure(object): object)  $build
     * @return Closure(object): object
     */
    public function remember(string $class, Closure $build): Closure
    {
        return $this->steps[$class] ??= $build();
    }
}
