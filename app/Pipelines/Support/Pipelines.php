<?php

declare(strict_types=1);

namespace App\Pipelines\Support;

use App\Pipelines\Contracts\Pipe;
use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Exceptions\StepOutOfOrder;
use Illuminate\Container\Attributes\Singleton;
use Illuminate\Contracts\Container\Container;
use ReflectionMethod;
use ReflectionNamedType;

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
     * @var array<class-string<PipelineDefinition>, list<array{pipe: Pipe, takes: class-string|null}>>
     */
    private array $resolved = [];

    public function __construct(private readonly Container $container) {}

    /**
     * @template TStage of object
     *
     * @param  class-string<PipelineDefinition>  $definition
     * @param  class-string<TStage>  $produces
     * @return TStage
     */
    public function run(string $definition, object $stage, string $produces): object
    {
        foreach ($this->resolved[$definition] ??= $this->resolve($definition) as $step) {
            if ($step['takes'] !== null && ! $stage instanceof $step['takes']) {
                throw StepOutOfOrder::handing($step['pipe']::class, $stage);
            }
            $stage = $step['pipe']->handle($stage);
        }
        if (! $stage instanceof $produces) {
            throw StepOutOfOrder::ending($definition, $produces, $stage);
        }

        return $stage;
    }

    /**
     * @param  class-string<PipelineDefinition>  $definition
     * @return list<array{pipe: Pipe, takes: class-string|null}>
     */
    private function resolve(string $definition): array
    {
        $steps = [];
        foreach ($this->container->make($definition)->pipes() as $pipeClass) {
            /**
             * @var Pipe $pipe
             */
            $pipe = $this->container->make($pipeClass);
            $type = new ReflectionMethod($pipe, 'handle')->getParameters()[0]->getType();
            /**
             * @var class-string|null $takes
             */
            $takes = $type instanceof ReflectionNamedType && ! $type->isBuiltin() ? $type->getName() : null;
            $steps[] = ['pipe' => $pipe, 'takes' => $takes];
        }

        return $steps;
    }
}
