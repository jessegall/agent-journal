<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Contracts\CommandMiddleware;
use App\Bus\Exceptions\CommandReplacedWithOtherClass;
use App\Bus\Exceptions\CommandReplacementRefused;
use App\Bus\Exceptions\CommandResultChanged;
use App\Bus\Exceptions\ContinuationCalledTwice;
use App\Bus\Exceptions\MiddlewareSkippedCommand;
use App\Bus\Exceptions\MiddlewareSwallowedFailure;
use Closure;
use Throwable;

/**
 * One module middleware held to the bus's contract (doc 19, section 6.3): it calls the next step once, may replace
 * the command only with a copy of the same class and only when it may (its own command, or an exported one), never
 * returns without running the command, never swallows a failure below it, and returns the result unchanged. A
 * middleware that throws, refusing the command, is let through.
 */
final readonly class MiddlewareStep
{
    public function __construct(
        private CommandMiddleware $middleware,
        private RegisteredMiddleware $entry,
    ) {}

    /**
     * @param  Closure(CommandCall): mixed  $next
     */
    public function handle(CommandCall $call, Closure $next): mixed
    {
        $name = $this->entry->middlewareClass();
        $record = new ContinuationRecord();

        $middlewareReply = $this->middleware->handle($call, function (
            CommandCall $passed,
        ) use ($call, $next, $name, $record): mixed {
            if ($record->called) {
                throw ContinuationCalledTwice::by($name);
            }

            $record->called = true;
            $this->assertValidReplacement($call, $passed, $name);

            try {
                return $record->continuationReply = $next($passed);
            } catch (Throwable $failure) {
                $record->failure = $failure;

                throw $failure;
            }
        });

        if (! $record->called) {
            throw MiddlewareSkippedCommand::by($name);
        }

        if ($record->failure !== null) {
            throw MiddlewareSwallowedFailure::by($name, $record->failure);
        }

        if ($middlewareReply !== $record->continuationReply) {
            throw CommandResultChanged::by($name);
        }

        return $middlewareReply;
    }

    private function assertValidReplacement(CommandCall $call, CommandCall $passed, string $name): void
    {
        if ($passed->command() === $call->command()) {
            return;
        }

        if ($passed->name() !== $call->name()) {
            throw CommandReplacedWithOtherClass::for($call->name(), $passed->name());
        }

        if ($this->entry->owner !== $call->owner() && ! $call->isExported()) {
            throw CommandReplacementRefused::for($name, $call->name());
        }
    }
}
