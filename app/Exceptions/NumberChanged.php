<?php

declare(strict_types=1);

namespace App\Exceptions;

use Illuminate\Database\Eloquent\Model;
use LogicException;

/**
 * A saved numbered record was given another number or group; a number is fixed once the record exists.
 */
final class NumberChanged extends LogicException
{
    public static function for(Model $record): self
    {
        return new self(
            'The number of '.$record->getMorphClass().' '.$record->getKey().' cannot change once it is saved.',
        );
    }
}
