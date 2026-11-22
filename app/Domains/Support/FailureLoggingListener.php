<?php

declare(strict_types=1);

namespace App\Domains\Support;

use Illuminate\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use Psr\Log\LoggerInterface;
use Throwable;

/**
 * Runs one listener of a committed fact and logs its failure instead of passing it on. The log names the fact, the
 * listener and the kind of failure, never the failure's text, which may quote what the fact is about.
 */
final readonly class FailureLoggingListener
{
    /**
     * @param  string|AvailableListener  $listener  the listener as the event map names it, or gated by its domain
     */
    public function __construct(public string $event, public string|AvailableListener $listener) {}

    public function __invoke(mixed ...$eventArguments): mixed
    {
        $container = Container::getInstance();

        try {
            return is_string($this->listener)
                ? $container->make(Dispatcher::class)->makeListener($this->listener)('', $eventArguments)
                : ($this->listener)(...$eventArguments);
        } catch (Throwable $failure) {
            $container->make(LoggerInterface::class)->error('A listener of a committed fact failed.', [
                'event' => $this->event,
                'listener' => is_string($this->listener) ? $this->listener : $this->listener->listener,
                'failure' => $failure::class,
                'exception' => $failure,
            ]);

            return null;
        }
    }
}
