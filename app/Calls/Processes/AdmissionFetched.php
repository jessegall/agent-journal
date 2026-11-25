<?php

declare(strict_types=1);

namespace App\Calls\Processes;

use App\Enums\Processes\AdmissionState;
use Spatie\LaravelData\Attributes\PropertyForMorph;
use Spatie\LaravelData\Contracts\PropertyMorphableData;
use Spatie\LaravelData\Data;

/**
 * The answer to fetching an admission: a run to start with its material, or a run another request already started.
 */
abstract class AdmissionFetched extends Data implements PropertyMorphableData
{
    #[PropertyForMorph]
    public AdmissionState $state;

    /**
     * @param  array{state: AdmissionState}  $properties
     */
    public static function morph(array $properties): string
    {
        return $properties['state']->answerClass();
    }
}
