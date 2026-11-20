<?php

declare(strict_types=1);

namespace App\Domains\Exceptions;

/**
 * A listener the application may not register: it hears an event its domain may not see, or the event cache no
 * longer matches the code.
 */
final class InvalidListener extends DomainDeclarationError
{
    public static function privateEvent(string $listener, string $method, string $event, string $owner): self
    {
        return new self(
            sprintf(
                '%s (%s) hears %s, which %s does not export under events; %s must export it, or the listener must go.',
                $listener,
                $method,
                $event,
                $owner,
                $owner,
            ),
        );
    }

    public static function notRequired(string $listener, string $event, string $owner): self
    {
        return new self(
            sprintf(
                '%s hears %s of %s, a domain its own domain does not require; hear it through an event of a domain it requires, or move the listener.',
                $listener,
                $event,
                $owner,
            ),
        );
    }

    public static function notAConcreteEvent(string $listener, string $event): self
    {
        return new self(
            sprintf(
                '%s hears %s, which is not a concrete class implementing App\\Contracts\\Event; type the listener on the concrete event.',
                $listener,
                $event,
            ),
        );
    }

    public static function unknownOwner(string $listener, string $event): self
    {
        return new self(
            sprintf(
                '%s hears %s, but the listener or the event belongs to no domain and not to Core; put the listener in a Listeners folder of its owner.',
                $listener,
                $event,
            ),
        );
    }

    public static function staleCache(string $listener, string $event): self
    {
        return new self(
            "{$listener} no longer hears {$event} as the event map says; run php artisan event:cache to rebuild it.",
        );
    }

    public static function stateRegisteredByHand(string $listener, string $event): self
    {
        return new self("{$listener} cannot be registered directly for {$event}. Register its state loader instead.");
    }

    public static function cacheMissing(string $provider): self
    {
        return new self(
            "The cached events hold no entry for {$provider}; run php artisan event:cache to rebuild them.",
        );
    }
}
