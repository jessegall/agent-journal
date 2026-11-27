<?php

declare(strict_types=1);

namespace App\Pipelines\Support;

use App\Bus\Contracts\Pipable;
use Closure;

/**
 * One of two steps, picked for each value by a condition: the first when it holds, the second when it does not.
 */
final readonly class ConditionalStep extends Step
{
    /**
     * @param  class-string<Pipable>  $then
     * @param  class-string<Pipable>|null  $else  none lets the value go on as it came
     */
    public function __construct(private Closure $condition, private string $then, private string|null $else = null) {}

    public function run(Closure $sequence): Closure
    {
        $condition = $this->condition;
        $then = $sequence([$this->then]);
        $else = $this->else === null ? fn (object $stepInput): object => $stepInput : $sequence([$this->else]);

        return fn (object $stepInput): object => $condition($stepInput) ? $then($stepInput) : $else($stepInput);
    }
}
