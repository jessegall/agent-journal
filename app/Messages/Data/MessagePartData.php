<?php

declare(strict_types=1);

namespace App\Messages\Data;

use App\Agents\Drivers\Contracts\MessagePart;
use App\Messages\Enums\MessagePartType;
use Spatie\LaravelData\Attributes\PropertyForMorph;
use Spatie\LaravelData\Contracts\PropertyMorphableData;
use Spatie\LaravelData\Data;

/**
 * A delivery part as it is stored: the Data of each part type, chosen by its type when it is read back.
 */
abstract class MessagePartData extends Data implements MessagePart, PropertyMorphableData
{
    /**
     * The property the data is morphed by, as the library hands it to morph() before any data exists.
     */
    private const string MORPHED_BY = 'type';

    #[PropertyForMorph]
    public MessagePartType $type;

    /**
     * @param  array{type: MessagePartType}  $properties
     */
    public static function morph(array $properties): string
    {
        return $properties[self::MORPHED_BY]->dataClass();
    }
}
