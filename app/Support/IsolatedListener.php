<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\CommittedFactListenerFailed;
use Illuminate\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use Throwable;

/**
 * Runs one listener of a committed fact apart from the others: its failure does not stop the listeners and facts
 * after it, and is handed to the publication, which throws it once every fact was handed out. It is never dropped.
 */
final readonly class IsolatedListener
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
            $listener = is_string($this->listener) ? $this->listener : $this->listener->listener;

            $container->make(Publication::class)->fail(
                CommittedFactListenerFailed::of($this->event, $listener, $failure),
            );

            return null;
        }
    }
}
