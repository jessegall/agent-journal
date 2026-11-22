<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Pipable;
use Closure;

/**
 * A step a pipeline lists inline beside its pipes and pipelines: steps repeated round after round, one of two steps
 * chosen by a condition, or a step a resolver names for each value. It only says what runs; the runner runs it.
 */
abstract readonly class Step implements Pipable
{
    /**
     * Runs the steps round after round for as long as the condition holds for the value; the condition is asked
     * before each round, so a value it does not hold for passes through unchanged.
     *
     * @param  class-string<Pipable>|Step|list<class-string<Pipable>|Step>  $steps
     * @param  Closure  $while  takes the value and answers whether another round runs
     */
    public static function repeated(string|Step|array $steps, Closure $while): RepeatedStep
    {
        return new RepeatedStep(is_array($steps) ? $steps : [$steps], $while);
    }

    /**
     * Runs one of two steps: the first when the condition holds for the value, the second when it does not.
     *
     * @param  Closure  $condition  takes the value and answers yes or no
     * @param  class-string<Pipable>  $then
     * @param  class-string<Pipable>  $else
     */
    public static function chosen(Closure $condition, string $then, string $else): ChosenStep
    {
        return new ChosenStep($condition, $then, $else);
    }

    /**
     * Runs the pipe or pipeline a resolver names for the value.
     *
     * @param  Closure  $resolve  takes the value and answers the class of the step that runs on it
     */
    public static function resolvedBy(Closure $resolve): ResolverStep
    {
        return new ResolverStep($resolve);
    }

    /**
     * The step as the runner runs it, given the way the runner turns a list of steps into one run.
     *
     * @param  Closure(list<class-string<Pipable>|Step>): (Closure(object): object)  $sequence
     * @return Closure(object): object
     */
    abstract public function run(Closure $sequence): Closure;
}
