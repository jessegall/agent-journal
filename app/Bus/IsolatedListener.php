<?php

declare(strict_types=1);

namespace App\Bus;

use App\Bus\Exceptions\CommittedFactListenerFailed;
use App\Bus\Values\ListenerRun;
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
            if (is_string($this->listener)) {
                return $container->make(Dispatcher::class)->makeListener($this->listener)('', $eventArguments);
            }

            return ($this->listener)(...$eventArguments);
        } catch (Throwable $failure) {
            $listener = is_string($this->listener) ? $this->listener : $this->listener->listener;
            $event = $eventArguments[0] ?? null;
            $run = is_object($event) ? new ListenerRun($listener, $event) : null;

            $container->make(Publication::class)->fail(
                CommittedFactListenerFailed::of($this->event, $listener, $failure, $run),
            );

            return null;
        }
    }
}
