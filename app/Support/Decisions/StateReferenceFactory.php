<?php

declare(strict_types=1);

namespace App\Support\Decisions;

use App\Enums\NoSubject;
use App\Exceptions\StateTypeMissing;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;

/**
 * The base of a domain's state references: the class names its state type once in TYPE_KEY and builds references
 * about a subject, so no domain writes the type key out by hand.
 */
abstract class StateReferenceFactory
{
    /**
     * The registered state type a subclass names; the base names none.
     */
    public const string TYPE_KEY = '';

    /**
     * The reference of this class's state type about the subject, with the state's first values by the name of its data.
     *
     * @param  array<string, mixed>  $values
     *
     * @throws StateTypeMissing when the class names no type
     */
    protected static function about(SubjectReference|NoSubject $subject, array $values = []): StateReference
    {
        if (static::TYPE_KEY === '') {
            throw StateTypeMissing::forClass(static::class);
        }

        return new StateReference(static::TYPE_KEY, $subject, $values);
    }
}
