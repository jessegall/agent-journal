<?php

declare(strict_types=1);

namespace App\Core\Bus\Support;

use App\Core\Actors\Contracts\CurrentActor;
use App\Core\Bus\Contracts\Command;
use App\Core\Bus\Contracts\CommandMiddleware;
use App\Core\Bus\Enums\MiddlewareStage;
use Closure;
use Illuminate\Contracts\Container\Container;

/**
 * The one pipe on the bus's dispatcher: it builds the command's call, walks the frame (Core's steps and the module
 * middleware in their stages), and hands the latest command to the handler. The steps inside the transaction are
 * built afresh for each attempt, so a retried command starts them clean.
 */
final readonly class MiddlewareRunner
{
    public function __construct(
        private Container $container,
        private CommandRegistry $registry,
        private CurrentActor $actors,
        private CommandNesting $nesting,
    ) {}

    /**
     * @param  Command<mixed>  $command
     * @param  Closure(Command<mixed>): mixed  $next  Laravel's continuation, which calls the handler
     */
    public function handle(Command $command, Closure $next): mixed
    {
        $this->nesting->enter();

        try {
            $name = $command::class;
            $call = CommandCall::of($command, $this->registry->ownerOf($name), $this->registry->isExported($name), $this->registry->needsRepeatableRead($name), $this->actors->hasActor() ? $this->actors->actor() : null);
            $inside = fn (CommandCall $current, Closure $handler) => $this->through([...$this->core(CommandFrame::INSIDE), ...$this->module($name, MiddlewareStage::InsideTransaction)], $current, $handler);
            $steps = [
                ...$this->core(CommandFrame::FIRST),
                ...$this->module($name, MiddlewareStage::BeforeTransaction),
                $this->container->make(CommandFrame::TRANSACTION),
                $inside,
            ];

            return $this->through($steps, $call, fn (CommandCall $current) => $next($current->command()));
        } finally {
            $this->nesting->leave();
        }
    }

    /**
     * Runs the call through the steps in order and then the last continuation.
     *
     * @param  list<CommandMiddleware|MiddlewareStep|Closure(CommandCall, Closure): mixed>  $steps
     * @param  Closure(CommandCall): mixed  $last
     */
    private function through(array $steps, CommandCall $call, Closure $last): mixed
    {
        $chain = array_reduce(
            array_reverse($steps),
            fn (Closure $next, CommandMiddleware|MiddlewareStep|Closure $step) => fn (CommandCall $current) => $step instanceof Closure ? $step($current, $next) : $step->handle($current, $next),
            $last,
        );

        return $chain($call);
    }

    /**
     * @param  list<class-string<CommandMiddleware>>  $classes
     * @return list<CommandMiddleware>
     */
    private function core(array $classes): array
    {
        return array_map(fn (string $class) => $this->container->make($class), $classes);
    }

    /**
     * @return list<MiddlewareStep>
     */
    private function module(string $command, MiddlewareStage $stage): array
    {
        $entries = array_filter($this->registry->middlewareFor($command), fn (RegisteredMiddleware $entry) => $entry->runsIn($stage));

        return array_values(array_map(fn (RegisteredMiddleware $entry) => new MiddlewareStep($this->container->make($entry->middlewareClass()), $entry), $entries));
    }
}
