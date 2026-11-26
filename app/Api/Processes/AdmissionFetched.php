<?php

declare(strict_types=1);

namespace App\Api\Processes;

use App\Processes\Enums\AdmissionStatus;
use Spatie\LaravelData\Attributes\PropertyForMorph;
use Spatie\LaravelData\Contracts\PropertyMorphableData;
use Spatie\LaravelData\Data;

/**
 * The answer to fetching an admission: a run to start with its material, or a run another request already started.
 */
abstract class AdmissionFetched extends Data implements PropertyMorphableData
{
    /**
     * The property the answer is morphed by, as the library hands it to morph() before any answer exists.
     */
    private const string MORPHED_BY = 'status';

    #[PropertyForMorph]
    public AdmissionStatus $status;

    /**
     * @param  array{status: AdmissionStatus}  $properties
     */
    public static function morph(array $properties): string
    {
        return $properties[self::MORPHED_BY]->answerClass();
    }
}
