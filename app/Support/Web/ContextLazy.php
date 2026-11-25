<?php

declare(strict_types=1);

namespace App\Support\Web;

use Closure;
use Inertia\AlwaysProp;
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
}
