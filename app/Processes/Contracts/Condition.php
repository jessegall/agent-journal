<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

/**
 * A named fact about a context, such as "this start is a turn": a rule of a declared list applies while it holds.
 *
 * @template-contravariant TContext of object
 */
interface Condition
{
    /**
     * Whether the fact holds for the context the list is built for.
     *
     * @param  TContext  $context
     */
    public function holdsFor(object $context): bool;
}
