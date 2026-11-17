<?php

declare(strict_types=1);

namespace App\Core\Hooks\Stack;

use App\Core\Hooks\Storage\FrameRecord;
use UnexpectedValueException;

final class StateSchemaUnknown extends UnexpectedValueException
{
    public static function for(FrameRecord $record, int $knownVersion): self
    {
        return new self("The frame {$record->id} of {$record->reference->typeKey} is stored in version {$record->schemaVersion}; this type reads version {$knownVersion}.");
    }
}
