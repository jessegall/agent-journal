<?php

declare(strict_types=1);

namespace App\Pipelines\Support;

use App\Bus\Contracts\Pipable;
use App\Bus\Contracts\PipelineDefinition;
use App\Bus\Contracts\PipelineRunner as PipelineRunnerContract;
use App\Pipelines\Exceptions\StepOutOfOrder;
use App\Reflection\Contracts\ReflectorFactory;
use Closure;
use Illuminate\Container\Attributes\Singleton;
use Illuminate\Container\Container;

/**
 * Runs a pipeline definition: every step in turn takes the output of the step before it. A step is a pipe, another
 * pipeline run as one step, or a Step listed inline: steps repeated while a condition holds, or a step chosen for each
 * value. Each pipe and pipeline is built once per request by the container, with the input a pipe takes read by
 * reflection, and kept in BuiltSteps for the rest of that request, so a pipe may take services that hold the request
 * in hand. A pipe handed an input it does not take, or a run that ends on an output the caller does not read, throws
 * StepOutOfOrder.
 *
 * The runner outlives a request, as do the registries that hold it, so it builds from the container of the request,
 * task or tick in hand (the one Octane makes current), never from the one it was made in.
 */
#[Singleton]
final class PipelineRunner implements PipelineRunnerContract
{
    public function __construct(private readonly ReflectorFactory $reflectors) {}

    /**
     * Runs the input through every step of the definition and returns the output of the last step.
     *
     * @template TOutput of object
     *
     * @param  class-string<PipelineDefinition<object, object>>  $definition
     * @param  class-string<TOutput>  $output
     * @return TOutput
     */
    public function run(string $definition, object $input, string $output): object
    {
        $pipelineOutput = $this->step($definition)($input);

        if (! $this->reflectors->make($output)->isInstance($pipelineOutput)) {
            throw StepOutOfOrder::ending($definition, $output, $pipelineOutput);
        }

        return $pipelineOutput;
    }

    /**
     * Runs the input through the steps listed here, in order, with no definition class.
     *
     * @template TOutput of object
     *
     * @param  list<class-string<Pipable>|Step>  $steps
     * @param  class-string<TOutput>  $output
     * @return TOutput
     */
    public function runSteps(array $steps, object $input, string $output): object
    {
        $pipelineOutput = $this->sequence($steps)($input);

        if (! $this->reflectors->make($output)->isInstance($pipelineOutput)) {
            throw StepOutOfOrder::endingSteps($output, $pipelineOutput);
        }

        return $pipelineOutput;
    }

    /**
     * The pipe or pipeline a class names, built the first time it runs in the request in hand.
     *
     * @param  class-string<Pipable>  $class
     * @return Closure(object): object
     */
    private function step(string $class): Closure
    {
        $container = Container::getInstance();

        return $container->make(BuiltSteps::class)->remember($class, fn () => $this->build($container->make($class)));
    }

    /**
     * @return Closure(object): object
     */
    private function build(object $made): Closure
    {
        if ($made instanceof PipelineDefinition) {
            return $this->checked($made, $this->sequence($made->pipes()));
        }

        return ResolvedPipe::of($made)->handle(...);
    }

    /**
     * The definition's run between its two checks: the value handed in must be its declared input before the first
     * step, and the value coming out its declared output after the last.
     *
     * @param  PipelineDefinition<object, object>  $definition
     * @param  Closure(object): object  $run
     * @return Closure(object): object
     */
    private function checked(PipelineDefinition $definition, Closure $run): Closure
    {
        $input = $this->reflectors->make($definition->input);
        $output = $this->reflectors->make($definition->output);

        return function (object $value) use ($definition, $input, $output, $run): object {
            if (! $input->isInstance($value)) {
                throw StepOutOfOrder::entering($definition::class, $definition->input, $value);
            }

            $handedOut = $run($value);

            if (! $output->isInstance($handedOut)) {
                throw StepOutOfOrder::leaving($definition::class, $definition->output, $handedOut);
            }

            return $handedOut;
        };
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
            $stepInput = $input;

            foreach ($runs as $run) {
                $stepInput = $run($stepInput);
            }

            return $stepInput;
        };
    }

    /**
     * @param  class-string<Pipable>|Step  $step
     * @return Closure(object): object
     */
    private function runOf(string|Step $step): Closure
    {
        if (is_string($step)) {
            return fn (object $stepInput): object => $this->step($step)($stepInput);
        }

        return $step->run($this->sequence(...));
    }
}
