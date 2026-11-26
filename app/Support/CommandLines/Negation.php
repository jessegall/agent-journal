<?php

declare(strict_types=1);

namespace App\Support\CommandLines;

use App\Contracts\CommandLines\Condition;

/**
 * The condition that holds while another does not.
 *
 * @template-contravariant TContext of object
 *
 * @implements Condition<TContext>
 */
final readonly class Negation implements Condition
{
    /**
     * @param  Condition<TContext>  $condition
     */
    public function __construct(private Condition $condition) {}

    public function holdsFor(object $context): bool
    {
        return ! $this->condition->holdsFor($context);
    }
}
