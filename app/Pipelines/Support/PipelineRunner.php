<?php

declare(strict_types=1);

namespace App\Pipelines\Support;

use App\Bus\Contracts\Pipable;
use App\Bus\Contracts\Pipe;
use App\Bus\Contracts\PipelineDefinition;
use App\Bus\Contracts\PipelineRunner as PipelineRunnerContract;
use App\Pipelines\Exceptions\StepOutOfOrder;
use App\Reflection\Contracts\ReflectorFactory;
use Closure;
use Illuminate\Container\Attributes\Config;
use Illuminate\Container\Attributes\Singleton;
use Illuminate\Container\Container;

/**
 * Runs a pipeline: each step is handed the carried value and the rest, configured middleware first (docs/pipelines.md).
 * It builds every pipe once per request from the container in hand; a value out of order throws StepOutOfOrder.
 */
#[Singleton]
final class PipelineRunner implements PipelineRunnerContract
{
    /**
     * @param  array<class-string<PipelineDefinition<object, object>>, list<class-string<Pipe>>>  $middleware
     */
    public function __construct(
        private readonly ReflectorFactory $reflectors,
        #[Config('journal.pipelines.middleware')]
        private readonly array $middleware,
    ) {}

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
        $pipelineOutput = $this->step($definition)($input, self::end(...));

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
        $pipelineOutput = $this->sequence($steps)($input, self::end(...));

        if (! $this->reflectors->make($output)->isInstance($pipelineOutput)) {
            throw StepOutOfOrder::endingSteps($output, $pipelineOutput);
        }

        return $pipelineOutput;
    }

    /**
     * The pipe or pipeline a class names, built the first time it runs in the request in hand.
     *
     * @param  class-string<Pipable>  $class
     * @return Closure(object, Closure(object): object): object
     */
    private function step(string $class): Closure
    {
        $container = Container::getInstance();

        return $container->make(BuiltSteps::class)->remember($class, fn () => $this->build($container->make($class)));
    }

    /**
     * A pipeline runs whole as one step, its middleware first, and what it hands out is carried on.
     *
     * @return Closure(object, Closure(object): object): object
     */
    private function build(object $made): Closure
    {
        if (! $made instanceof PipelineDefinition) {
            return ResolvedPipe::of($made)->handle(...);
        }

        $steps = $this->sequence([...$this->middleware[$made::class] ?? [], ...$made->pipes()]);
        $whole = $this->checked($made, fn (object $input): object => $steps($input, self::end(...)));

        return fn (object $carried, Closure $next): object => $next($whole($carried));
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
     * One run through the steps in order, chained from the last back so each step's next is the rest. A pipe or
     * pipeline is looked up only when the run reaches it, so a pipeline may list a pipeline that lists it again.
     *
     * @param  list<class-string<Pipable>|Step>  $steps
     * @return Closure(object, Closure(object): object): object
     */
    private function sequence(array $steps): Closure
    {
        $runs = array_map($this->runOf(...), $steps);

        return fn (object $carried, Closure $next): object => array_reduce(
            array_reverse($runs),
            fn (Closure $rest, Closure $run): Closure => fn (object $value): object => $run($value, $rest),
            $next,
        )($carried);
    }

    /**
     * @param  class-string<Pipable>|Step  $step
     * @return Closure(object, Closure(object): object): object
     */
    private function runOf(string|Step $step): Closure
    {
        if (is_string($step)) {
            return fn (object $carried, Closure $next): object => $this->step($step)($carried, $next);
        }

        return $step->run($this->sequence(...));
    }

    /**
     * The end of a run: the value the last step carried is the run's output.
     */
    private static function end(object $carried): object
    {
        return $carried;
    }
}
