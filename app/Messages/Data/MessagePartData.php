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
    #[PropertyForMorph]
    public MessagePartType $type;

    /**
     * @param  array{type: MessagePartType}  $properties
     */
    public static function morph(array $properties): string
    {
        return $properties['type']->dataClass();
    }
}
