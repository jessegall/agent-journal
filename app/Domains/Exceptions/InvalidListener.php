<?php

declare(strict_types=1);

namespace App\Domains\Exceptions;

/**
 * A listener the application may not register: it listens to an event its domain may not see, or the event cache no
 * longer matches the code.
 */
final class InvalidListener extends DomainDeclarationError
{
    public static function privateEvent(string $listener, string $method, string $event, string $owner): self
    {
        return new self(
            sprintf(
                '%s (%s) listens to %s, which %s does not export under events; %s must export it, or the listener must go.',
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
                '%s listens to %s of %s, a domain its own domain does not require; listen to it through an event of a domain it requires, or move the listener.',
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
                '%s listens to %s, which is not a concrete class implementing App\\Contracts\\Event; type the listener on the concrete event.',
                $listener,
                $event,
            ),
        );
    }

    public static function unknownOwner(string $listener, string $event): self
    {
        return new self(
            sprintf(
                '%s listens to %s, but the listener or the event belongs to no domain and not to Core; put the listener in a Listeners folder of its owner.',
                $listener,
                $event,
            ),
        );
    }

    public static function staleCache(string $listener, string $event): self
    {
        return new self(
            "{$listener} no longer listens to {$event} as the event map says; run php artisan event:cache to rebuild it.",
        );
    }

    public static function stateRegisteredByHand(string $listener, string $event): self
    {
        return new self("{$listener} cannot be registered directly for {$event}. Register its state loader instead.");
    }

    public static function stateCacheChanged(): self
    {
        return new self('The state event declarations changed. Run php artisan event:cache to rebuild them.');
    }

    public static function requiredButDeferred(string $listener, string $event, string $interface): self
    {
        return new self(
            "{$listener} runs in the command's transaction for {$event}, so it cannot implement {$interface}; "
            .'drop the interface, or the InCommandTransaction attribute.',
        );
    }

    public static function requiredTwice(string $listener, string $event): self
    {
        return new self("{$listener} is registered twice as a required listener of {$event}; register it once.");
    }

    public static function requiredWithoutDeclaration(string $listener, string $event, string $owner): self
    {
        return new self(
            "{$listener} of {$owner} cannot run in the transaction of {$event}, whose write another owner holds; "
            .'the event must name it with #[RequiresListener].',
        );
    }

    public static function cacheBeforeLanes(): self
    {
        return new self(
            'The cached events were built before required listeners had their own lane; run php artisan event:cache.',
        );
    }

    public static function cacheMissing(string $provider): self
    {
        return new self(
            "The cached events hold no entry for {$provider}; run php artisan event:cache to rebuild them.",
        );
    }
}
