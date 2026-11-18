<?php

declare(strict_types=1);

namespace App\Pipelines\Support;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Exceptions\StepOutOfOrder;
use Illuminate\Container\Attributes\Singleton;
use Illuminate\Contracts\Container\Container;

/**
 * Runs a pipeline definition: every pipe in turn takes the stage the one before returned, and a pipe may run another
 * pipeline, so pipelines nest. Each definition is resolved once per process, its pipes built by the container and the
 * stage each takes read by reflection, and kept for every later run; a pipe therefore holds only services that are the
 * same for every request, never request data. A pipe handed a stage it does not take, or a run that ends on a stage the
 * caller does not read, throws StepOutOfOrder.
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
     * Runs the input through every pipe of the definition and returns the stage the last pipe produced.
     *
     * @template TOutput of object
     *
     * @param  class-string<PipelineDefinition>  $definition
     * @param  class-string<TOutput>  $output
     * @return TOutput
     */
    public function run(string $definition, object $input, string $output): object
    {
        $stage = $input;
        foreach ($this->resolved[$definition] ??= $this->resolve($definition) as $pipe) {
            $stage = $pipe->handle($stage);
        }
        if (! $stage instanceof $output) {
            throw StepOutOfOrder::ending($definition, $output, $stage);
        }

        return $stage;
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
