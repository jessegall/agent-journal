<?php

declare(strict_types=1);

namespace App\Pipelines\Support;

use App\Pipelines\Contracts\Pipable;
use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Exceptions\StepOutOfOrder;
use Closure;
use Illuminate\Container\Attributes\Singleton;
use Illuminate\Contracts\Container\Container;

/**
 * Runs a pipeline definition: every step in turn takes the output of the step before it. A step is a pipe, another
 * pipeline run as one step, or a Step listed inline: steps repeated while a condition holds, or a step chosen for each
 * value. Each pipe and pipeline is built once per process by the container, with the input a pipe takes read by
 * reflection, and kept for every later run; a step therefore holds only services that are the same for every request,
 * never request data. A pipe handed an input it does not take, or a run that ends on an output the caller does not
 * read, throws StepOutOfOrder.
 */
#[Singleton]
final class Pipelines
{
    /**
     * @var array<class-string<Pipable>, Closure(object): object>
     */
    private array $steps = [];

    public function __construct(private readonly Container $container) {}

    /**
     * Runs the input through every step of the definition and returns the output of the last step.
     *
     * @template TOutput of object
     *
     * @param  class-string<PipelineDefinition>  $definition
     * @param  class-string<TOutput>  $output
     * @return TOutput
     */
    public function run(string $definition, object $input, string $output): object
    {
        $result = $this->step($definition)($input);

        if (! $result instanceof $output) {
            throw StepOutOfOrder::ending($definition, $output, $result);
        }

        return $result;
    }

    /**
     * The pipe or pipeline a class names, built the first time it runs.
     *
     * @param  class-string<Pipable>  $class
     * @return Closure(object): object
     */
    private function step(string $class): Closure
    {
        return $this->steps[$class] ??= $this->build($this->container->make($class));
    }

    /**
     * @return Closure(object): object
     */
    private function build(object $made): Closure
    {
        if ($made instanceof PipelineDefinition) {
            return $this->sequence($made->pipes());
        }

        return ResolvedPipe::of($made)->handle(...);
    }

    /**
     * One run through the steps in order. A pipe or pipeline is looked up only when the run reaches it, so a pipeline
     * may list a pipeline that lists it again.
     *
     * @param  list<class-string<Pipable>|Step>  $steps
     * @return Closure(object): object
     */
    private function sequence(array $steps): Closure
    {
        $runs = array_map($this->runOf(...), $steps);

        return function (object $input) use ($runs): object {
            $value = $input;
            foreach ($runs as $run) {
                $value = $run($value);
            }

            return $value;
        };
    }

    /**
     * @param  class-string<Pipable>|Step  $step
     * @return Closure(object): object
     */
    private function runOf(string|Step $step): Closure
    {
        if (is_string($step)) {
            return fn (object $value): object => $this->step($step)($value);
        }

        return $step->run($this->sequence(...));
    }
}
