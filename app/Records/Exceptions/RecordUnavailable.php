<?php

declare(strict_types=1);

namespace App\Records\Exceptions;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use App\Records\Support\RecordIdentity;
use RuntimeException;

final class RecordUnavailable extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function for(RecordIdentity $record): self
    {
        return new self("{$record->type} {$record->id} does not exist or cannot be assigned by you.");
    }

    /**
     * A record that is missing or that the actor may not read or change, worded the same either way.
     */
    public static function forActor(RecordIdentity $record): self
    {
        return new self("{$record->type} {$record->id} does not exist or is not available to you.");
    }

    /**
     * A record named by its number that is missing or not available to the actor, worded like forActor.
     */
    public static function numbered(string $word, int $number): self
    {
        return new self("{$word} {$number} does not exist or is not available to you.");
    }

    protected function status(): int
    {
        return 404;
    }
}
