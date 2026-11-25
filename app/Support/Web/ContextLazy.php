<?php

declare(strict_types=1);

namespace App\Support\Web;

use App\Values\Web\LiveListeners;
use Closure;
use Inertia\AlwaysProp;
use Inertia\DeferProp;
use Inertia\LiveProp;
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
