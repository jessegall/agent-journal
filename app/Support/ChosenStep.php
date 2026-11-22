<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\Pipable;
use Closure;

/**
 * One of two steps, picked for each value by a condition: the first when it holds, the second when it does not.
 */
final readonly class ChosenStep extends Step
{
    /**
     * @param  class-string<Pipable>  $then
     * @param  class-string<Pipable>  $else
     */
    public function __construct(private Closure $condition, private string $then, private string $else) {}

    public function run(Closure $sequence): Closure
    {
        $condition = $this->condition;
        $then = $sequence([$this->then]);
        $else = $sequence([$this->else]);

        return fn (object $stepInput): object => $condition($stepInput) ? $then($stepInput) : $else($stepInput);
    }
}
