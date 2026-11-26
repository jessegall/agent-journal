<?php

declare(strict_types=1);

namespace App\Processes\Api;

use App\Processes\Enums\AdmissionStatus;
use Spatie\LaravelData\Attributes\PropertyForMorph;
use Spatie\LaravelData\Contracts\PropertyMorphableData;
use Spatie\LaravelData\Data;

/**
 * The answer to fetching an admission: a run to start with its material, or a run another request already started.
 */
abstract class AdmissionFetched extends Data implements PropertyMorphableData
{
    #[PropertyForMorph]
    public AdmissionStatus $status;

    /**
     * @param  array{state: AdmissionStatus}  $properties
     */
    public static function morph(array $properties): string
    {
        return $properties['state']->answerClass();
    }
}
