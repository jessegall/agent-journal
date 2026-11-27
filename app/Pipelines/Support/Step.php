<?php

declare(strict_types=1);

namespace App\Pipelines\Support;

use App\Bus\Contracts\Pipable;
use Closure;

/**
 * A step a pipeline lists inline beside its pipes and pipelines: steps repeated round after round, one of two steps
 * run on a condition, or a step a resolver names for each value. It only says what runs; the runner runs it.
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
     * The then steps when the condition holds of the value, else the else steps; with no else steps the value goes on
     * as it came. Each branch is one step or a list run in order.
     *
     * @param  class-string<Pipable>|Step|list<class-string<Pipable>|Step>  $then
     * @param  class-string<Pipable>|Step|list<class-string<Pipable>|Step>  $else
     */
    public static function conditional(
        Closure $condition,
        string|Step|array $then,
        string|Step|array $else = [],
    ): ConditionalStep {
        return new ConditionalStep($condition, is_array($then) ? $then : [$then], is_array($else) ? $else : [$else]);
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
     * The step as the runner runs it, given the way the runner turns a list of steps into one run: it takes the
     * carried value and the rest of the pipeline, and returns what the rest returns.
     *
     * @param  Closure(list<class-string<Pipable>|Step>): (Closure(object, Closure(object): object): object)  $sequence
     * @return Closure(object, Closure(object): object): object
     */
    abstract public function run(Closure $sequence): Closure;

    /**
     * The types the step carries on, read without running it, given the types carried to it and the way the validator
     * follows a list of steps; mixed stands for a type only a run can tell.
     *
     * @param  list<string>  $carried
     * @param  Closure(list<class-string<Pipable>|Step>, list<string>): list<string>  $follow
     * @return list<string>
     */
    abstract public function carriesOn(array $carried, Closure $follow): array;
}
