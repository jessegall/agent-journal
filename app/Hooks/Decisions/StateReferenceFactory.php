<?php

declare(strict_types=1);

namespace App\Hooks\Decisions;

use App\Hooks\Enums\NoSubject;
use App\Hooks\Exceptions\StateTypeMissing;

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
     * The reference of this class's state type about the subject.
     *
     * @throws StateTypeMissing when the class names no type
     */
    protected static function about(SubjectReference|NoSubject $subject): StateReference
    {
        if (static::TYPE_KEY === '') {
            throw StateTypeMissing::forClass(static::class);
        }

        return new StateReference(static::TYPE_KEY, $subject);
    }
}
