<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Assignments\Exceptions\Concerns\RendersRefusal;
use App\Assignments\Support\RecordIdentity;
use App\Contracts\CommandRefusal;
use RuntimeException;

final class AssignmentConflict extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function heldByAnother(RecordIdentity $record): self
    {
        return new self("{$record->type} {$record->id} is held by someone else; read its assignment and reassign it deliberately.");
    }

    public static function staleReference(RecordIdentity $record): self
    {
        return new self("The assignment of {$record->type} {$record->id} changed since it was read; read it again.");
    }

    protected function status(): int
    {
        return 409;
    }
}
