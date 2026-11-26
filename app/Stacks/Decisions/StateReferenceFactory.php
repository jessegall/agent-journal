<?php

declare(strict_types=1);

namespace App\Stacks\Decisions;

use App\Engine\Enums\NoSubject;
use App\Stacks\References\StateReference;
use App\Stacks\References\SubjectReference;

/**
 * The base of a domain's state references: the class answers its state type in key() and builds references about a
 * subject, so no domain writes the type key out by hand.
 */
abstract class StateReferenceFactory
{
    /**
     * The registered state type this class builds references of.
     */
    abstract public static function key(): string;

    /**
     * The reference of this class's state type about the subject, with the state's first values by the name of its data.
     *
     * @param  array<string, mixed>  $values
     */
    protected static function about(SubjectReference|NoSubject $subject, array $values = []): StateReference
    {
        return new StateReference(StateReferenceKeys::of(static::class), $subject, $values);
    }
}
