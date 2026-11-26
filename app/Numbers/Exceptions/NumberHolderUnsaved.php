<?php

declare(strict_types=1);

namespace App\Numbers\Exceptions;

use Illuminate\Database\Eloquent\Model;
use LogicException;

/**
 * A record was to be numbered within a holder that is not saved yet.
 */
final class NumberHolderUnsaved extends LogicException
{
    public static function for(Model $record): self
    {
        return new self('A '.$record->getMorphClass().' cannot be numbered within a holder that is not saved yet.');
    }
}
