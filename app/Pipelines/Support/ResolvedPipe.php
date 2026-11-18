<?php

declare(strict_types=1);

namespace App\Pipelines\Support;

use App\Pipelines\Contracts\Pipe;
use App\Pipelines\Exceptions\StepOutOfOrder;
use ReflectionMethod;
use ReflectionNamedType;

/**
 * A pipe of a resolved pipeline, with the stage class its handle method takes, read once by reflection.
 */
final readonly class ResolvedPipe
{
    /**
     * @param  class-string|null  $takes  the stage class handle takes, or null when it takes any object
     */
    private function __construct(
        private Pipe $pipe,
        private string|null $takes,
    ) {}

    public static function of(Pipe $pipe): self
    {
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
     * Hands the stage to the pipe and returns the stage it produces.
     *
     * @throws StepOutOfOrder when the pipe takes another stage
     */
    public function handle(object $stage): object
    {
        if ($this->takes !== null && ! $stage instanceof $this->takes) {
            throw StepOutOfOrder::handing($this->pipe::class, $stage);
        }

        return $this->pipe->handle($stage);
    }
}
