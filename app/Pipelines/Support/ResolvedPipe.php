<?php

declare(strict_types=1);

namespace App\Pipelines\Support;

use App\Pipelines\Contracts\Pipe;
use App\Pipelines\Exceptions\NotAPipelineStep;
use App\Pipelines\Exceptions\StepOutOfOrder;
use ReflectionMethod;
use ReflectionNamedType;

/**
 * A pipe of a resolved pipeline, with the input class its handle method takes, read once by reflection.
 */
final readonly class ResolvedPipe
{
    /**
     * @param  class-string|null  $takes  the input class handle takes, or null when it takes any object
     */
    private function __construct(
        private Pipe $pipe,
        private string|null $takes,
    ) {}

    /**
     * @throws NotAPipelineStep when a pipeline lists a class that is no pipe
     */
    public static function of(object $pipe): self
    {
        if (! $pipe instanceof Pipe) {
            throw NotAPipelineStep::named($pipe::class);
        }
        $type = new ReflectionMethod($pipe, 'handle')->getParameters()[0]->getType();

        if (! $type instanceof ReflectionNamedType || $type->isBuiltin()) {
            return new self($pipe, null);
        }

        /**
         * @var class-string $takes
         */
        $takes = $type->getName();

        return new self($pipe, $takes);
    }

    /**
     * Hands the input to the pipe and returns its output.
     *
     * @throws StepOutOfOrder when the pipe takes another input
     */
    public function handle(object $input): object
    {
        if ($this->takes !== null && ! $input instanceof $this->takes) {
            throw StepOutOfOrder::handing($this->pipe::class, $input);
        }

        return $this->pipe->handle($input);
    }
}
