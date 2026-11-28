<?php

declare(strict_types=1);

namespace App\Web;

use App\Web\Values\LiveListeners;
use Closure;
use Inertia\AlwaysProp;
use Inertia\DeferProp;
use Inertia\LiveProp;
use Inertia\OnceProp;
use Spatie\LaravelData\Support\Lazy\ConditionalLazy;

/**
 * A field of the app context that becomes the Inertia prop it needs when the context is turned into page props.
 */
final class ContextLazy extends ConditionalLazy
{
    /**
     * A prop sent on every visit, partial reloads included.
     */
    public static function always(Closure $read): self
    {
        return new self(fn () => true, fn () => new AlwaysProp($read));
    }

    /**
     * A prop sent with the first page and kept by the browser across visits under its key, sent again when it is
     * stale or the key changes, as it does for another viewer.
     */
    public static function once(Closure $read, bool $isStale, string $key): self
    {
        return new self(fn () => true, fn () => new OnceProp($read)->as($key)->fresh($isStale));
    }

    /**
     * A prop sent with the first page and kept by the browser across visits, sent again when it is stale and read
     * again when one of the events arrives, as a sign-in that ends in the background changes it.
     */
    public static function onceLive(Closure $read, bool $isStale, string $key, LiveListeners $listeners): self
    {
        return new self(
            fn () => true,
            fn () => new OnceProp($read)->as($key)->fresh($isStale)->live($listeners->events, $listeners->channel),
        );
    }

    /**
     * A prop read on a full visit, or on a partial reload that names it.
     */
    public static function value(Closure $read): self
    {
        return new self(fn () => true, fn () => $read);
    }

    /**
     * A prop read on a full visit or a partial reload that names it, and read again when one of the events arrives.
     */
    public static function live(Closure $read, LiveListeners $listeners): self
    {
        return new self(fn () => true, fn () => new LiveProp($read, $listeners->events, $listeners->channel));
    }

    /**
     * A prop read after the first paint with the rest of its group, and read again when one of the events arrives.
     */
    public static function deferredLive(Closure $read, string $group, LiveListeners $listeners): self
    {
        return new self(fn () => true, fn () => $listeners->mark(new DeferProp($read, $group)));
    }
}
