<?php

declare(strict_types=1);

namespace App\Pipelines\Support;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Exceptions\StepOutOfOrder;
use Illuminate\Container\Attributes\Singleton;
use Illuminate\Contracts\Container\Container;

/**
 * Runs a pipeline definition: every pipe in turn takes the output of the pipe before it, and a pipe may run another
 * pipeline, so pipelines nest. Each definition is resolved once per process, its pipes built by the container and the
 * input each takes read by reflection, and kept for every later run; a pipe therefore holds only services that are the
 * same for every request, never request data. A pipe handed an input it does not take, or a run that ends on an output
 * the caller does not read, throws StepOutOfOrder.
 */
#[Singleton]
final class Pipelines
{
    /**
     * @var array<class-string<PipelineDefinition>, list<ResolvedPipe>>
     */
    private array $resolved = [];

    public function __construct(private readonly Container $container) {}

    /**
     * Runs the input through every pipe of the definition and returns the output of the last pipe.
     *
     * @template TOutput of object
     *
     * @param  class-string<PipelineDefinition>  $definition
     * @param  class-string<TOutput>  $output
     * @return TOutput
     */
    public function run(string $definition, object $input, string $output): object
    {
        $result = $input;
        foreach ($this->resolved[$definition] ??= $this->resolve($definition) as $pipe) {
            $result = $pipe->handle($result);
        }
        if (! $result instanceof $output) {
            throw StepOutOfOrder::ending($definition, $output, $result);
        }

        return $result;
    }

    /**
     * @param  class-string<PipelineDefinition>  $definition
     * @return list<ResolvedPipe>
     */
    private function resolve(string $definition): array
    {
        $pipes = [];
        foreach ($this->container->make($definition)->pipes() as $pipe) {
            $pipes[] = ResolvedPipe::of($this->container->make($pipe));
        }

        return $pipes;
    }
}
