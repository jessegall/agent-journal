<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Actors\Contracts\CurrentActor;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandAdmission;
use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Enums\CommandAdmissionStage;
use App\Bus\Enums\CommandEntry;
use App\Bus\Enums\MiddlewareStage;
use App\Bus\Exceptions\DomainDisabled;
use App\Contracts\DomainAvailability;
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
        private DomainAvailability $availability,
        private CommandRegistry $registry,
        private CurrentActor $actors,
        private CommandNesting $nesting,
        private CommandSubjects $subjects,
        private CommandAdmission $admission,
    ) {}

    /**
     * @param  Command<mixed>  $command
     * @param  Closure(Command<mixed>): mixed  $next  Laravel's continuation, which calls the handler
     */
    public function handle(Command $command, Closure $next): mixed
    {
        $this->nesting->enter($command::class);

        try {
            $name = $command::class;
            $owner = $this->registry->ownerOf($name);
            $call = CommandCall::of(
                $command,
                $owner,
                $this->registry->isExported($name),
                $this->registry->needsRepeatableRead($name),
                $this->actors->hasActor() ? $this->actors->actor() : null,
            );
            $inside = fn (CommandCall $current, Closure $handler) => $this->through(
                [...$this->core(CommandFrame::INSIDE), ...$this->module($name, MiddlewareStage::InsideTransaction)],
                $current,
                $handler,
            );
            $steps = [
                ...$this->core(CommandFrame::FIRST),
                fn (
                    CommandCall $current,
                    Closure $next,
                ) => $this->isAvailable($owner) ? $next($current) : throw DomainDisabled::for($owner, $name),
                fn (CommandCall $current, Closure $next) => $this->through(
                    $this->module($name, MiddlewareStage::BeforeTransaction),
                    $current,
                    $next,
                ),
                $this->container->make(CommandFrame::TRANSACTION),
                $inside,
            ];

            return $this->through(
                $steps,
                $call,
                fn (CommandCall $current) => $this->handOver($current, $next),
            );
        } finally {
            $this->nesting->leave();
        }
    }

    private function handOver(CommandCall $call, Closure $next): mixed
    {
        if ($this->registry->entryOf($call->name()) === CommandEntry::Application) {
            $this->admission->assess(
                $this->registry->effective($call, CommandAdmissionStage::BeforeHandler),
            )->assertAllowed();
        }

        return $this->subjects->handOver($call, $next);
    }

    /**
     * Whether the owner's commands and middleware run now; Core's always do. Asked of the current request's
     * availability.
     */
    private function isAvailable(string $owner): bool
    {
        return $owner === CommandOwner::CORE || $this->availability->isEnabled($owner);
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
            fn (
                Closure $next,
                CommandMiddleware|MiddlewareStep|Closure $step,
            ) => fn (
                CommandCall $current,
            ) => $step instanceof Closure ? $step($current, $next) : $step->handle($current, $next),
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
     * The module middleware of the stage, built only now and only for owners that are available; Core's always runs.
     *
     * @return list<MiddlewareStep>
     */
    private function module(string $command, MiddlewareStage $stage): array
    {
        $middlewareRegistrations = array_filter(
            $this->registry->middlewareFor($command),
            fn (RegisteredMiddleware $entry) => $entry->runsIn($stage) && $this->isAvailable($entry->owner),
        );

        return array_values(
            array_map(
                fn (RegisteredMiddleware $entry) => new MiddlewareStep(
                    $this->container->make($entry->middlewareClass()),
                    $entry,
                ),
                $middlewareRegistrations,
            ),
        );
    }
}
