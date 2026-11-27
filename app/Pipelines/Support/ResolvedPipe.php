<?php

declare(strict_types=1);

namespace App\Pipelines\Support;

use App\Bus\Contracts\Pipe;
use App\Pipelines\Exceptions\NotAPipelineStep;
use App\Pipelines\Exceptions\StepOutOfOrder;
use App\Reflection\Exceptions\ClassMissing;
use App\Support\DeclaredType;
use App\Support\Reflector;
use PhpOption\None;

/**
 * A pipe of a resolved pipeline, with the input class its handle method takes, read once by reflection.
 */
final readonly class ResolvedPipe
{
    /**
     * @param  Reflector<object>|null  $takes  the input class handle takes, or null when it takes any object
     */
    private function __construct(
        private Pipe $pipe,
        private Reflector|null $takes,
    ) {}

    /**
     * @throws NotAPipelineStep when a pipeline lists a class that is no pipe
     * @throws ClassMissing when handle takes a class no autoloader can load
     */
    public static function of(object $pipe): self
    {
        if (! $pipe instanceof Pipe) {
            throw NotAPipelineStep::named($pipe::class);
        }

        $parameters = Reflector::of($pipe)->method('handle')->parameters();

        $type = $parameters === [] ? None::create() : $parameters[0]->type()
            ->filter(fn (DeclaredType $declared) => $declared->namesClass());

        if ($type->isEmpty()) {
            return new self($pipe, null);
        }

        $takes = $type->get()->name();

        return new self($pipe, Reflector::find($takes)->getOrThrow(ClassMissing::for($takes)));
    }

    /**
     * Hands the input to the pipe and returns its output.
     *
     * @throws StepOutOfOrder when the pipe takes another input
     */
    public function handle(object $input): object
    {
        if ($this->takes !== null && $this->takes->not()->isInstance($input)) {
            throw StepOutOfOrder::handing($this->pipe::class, $input);
        }

        return $this->pipe->handle($input);
    }
}
