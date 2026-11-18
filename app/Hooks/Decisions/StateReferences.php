<?php

declare(strict_types=1);

namespace App\Hooks\Decisions;

use App\Hooks\Exceptions\StateReferencesInvalid;

/**
 * The references of one batch of frames of one state type, in their stack order, at most 100.
 */
final readonly class StateReferences
{
    public const int MAXIMUM = 100;

    /**
     * @param  list<StateReference>  $all
     *
     * @throws StateReferencesInvalid
     */
    public function __construct(public array $all)
    {
        if (count($all) > self::MAXIMUM) {
            throw StateReferencesInvalid::tooMany(count($all));
        }
    }

    /**
     * The distinct ids of the subjects these references name, for one read of them all.
     *
     * @return list<string>
     */
    public function subjectIds(): array
    {
        $ids = [];

        foreach ($this->all as $reference) {
            if ($reference->subject instanceof SubjectReference) {
                $ids[$reference->subject->id] = $reference->subject->id;
            }
        }

        return array_values($ids);
    }
}
