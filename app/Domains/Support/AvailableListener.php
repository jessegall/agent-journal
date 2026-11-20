<?php

declare(strict_types=1);

namespace App\Domains\Support;

use App\Contracts\DomainAvailability;
use Illuminate\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * A domain's listener as the dispatcher holds it: it runs the real listener only while the domain that owns the
 * listener is available, asked when the event is delivered; otherwise the event passes it by.
 */
final readonly class AvailableListener
{
    /**
     * @param  string  $listener  the listener as the event map names it, Class or Class@method
     */
    public function __construct(public string $owner, public string $listener) {}

    public function __invoke(mixed ...$eventArguments): mixed
    {
        $container = Container::getInstance();

        if (! $container->make(DomainAvailability::class)->isEnabled($this->owner)) {
            return null;
        }

        return $container->make(Dispatcher::class)->makeListener($this->listener)('', $eventArguments);
    }
}
