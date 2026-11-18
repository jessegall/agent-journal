<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Assignments\Exceptions\Concerns\RendersRefusal;
use App\Assignments\Support\RecordIdentity;
use RuntimeException;

final class RecordUnavailable extends RuntimeException
{
    use RendersRefusal;

    public static function for(RecordIdentity $record): self
    {
        return new self("{$record->type} {$record->id} does not exist or cannot be assigned by you.");
    }

    protected function status(): int
    {
        return 404;
    }
}
