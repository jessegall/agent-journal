<?php

declare(strict_types=1);

namespace App\Core\Assignments\Exceptions;

use App\Core\Assignments\Support\RecordIdentity;
use RuntimeException;

final class AssignmentConflict extends RuntimeException
{
    public static function heldByAnother(RecordIdentity $record): self
    {
        return new self("{$record->type} {$record->id} is held by someone else; read its assignment and reassign it deliberately.");
    }

    public static function staleReference(RecordIdentity $record): self
    {
        return new self("The assignment of {$record->type} {$record->id} changed since it was read; read it again.");
    }
}
