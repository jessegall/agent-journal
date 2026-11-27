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
     * @param  list<class-string<Pipable>|Step>  $then
     * @param  list<class-string<Pipable>|Step>  $else  none lets the value go on as it came
     */
    public function __construct(private Closure $condition, private array $then, private array $else = []) {}

    public function run(Closure $sequence): Closure
    {
        $condition = $this->condition;
        $then = $sequence($this->then);
        $else = $sequence($this->else);

        return fn (object $carried, Closure $next): object => $condition($carried)
            ? $then($carried, $next)
            : $else($carried, $next);
    }

    public function carriesOn(array $carried, Closure $follow): array
    {
        return array_values(array_unique([...$follow($this->then, $carried), ...$follow($this->else, $carried)]));
    }
}
