<?php

declare(strict_types=1);

namespace App\Pipelines\Support;

use App\Bus\Contracts\Pipe;
use App\Pipelines\Exceptions\NotAPipelineStep;
use App\Pipelines\Exceptions\StepOutOfOrder;
use App\Reflection\Exceptions\ClassMissing;
use App\Support\DeclaredType;
use App\Support\Reflector;
use Closure;

/**
 * A pipe of a resolved pipeline, with how its handle method is called, read once by reflection: with the carried
 * value or the context, and with or without the rest of the pipeline as $next.
 */
final readonly class ResolvedPipe
{
    /**
     * @param  Reflector<object>|null  $takes  the value class handle takes, or null when it takes the context or any object
     */
    private function __construct(
        private Pipe $pipe,
        private Reflector|null $takes,
        private PipeSignature $signature,
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

        $signature = PipeSignature::of($pipe::class);
        $type = $signature->takes->filter(fn (DeclaredType $declared) => $declared->namesClass());

        if ($type->isEmpty()) {
            return new self($pipe, null, $signature);
        }

        $takes = Reflector::find($type->get()->name())->getOrThrow(ClassMissing::for($type->get()->name()));

        return new self($pipe, $takes, $signature);
    }

    /**
     * Hands the carried value, or its context, to the pipe. A pipe that takes $next is handed the rest of the pipeline
     * and returns the pipeline's output; any other returns the value the rest of the pipeline is run on.
     *
     * @param  Closure(object): object  $next
     *
     * @throws StepOutOfOrder when the pipe takes another value
     */
    public function handle(object $carried, Closure $next): object
    {
        if ($this->takes !== null && $this->takes->not()->isInstance($carried)) {
            throw StepOutOfOrder::handing($this->pipe::class, $carried);
        }

        $argument = $this->signature->takesContext ? new CarriedValue($carried) : $carried;

        if ($this->signature->takesNext) {
            return $this->pipe->handle($argument, $next);
        }

        return $next($this->pipe->handle($argument));
    }
}
