<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Contracts\RefusalDetails;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Bus\Values\RecoveryCall;
use App\Contracts\CommandRefusal;
use App\Records\Support\RecordIdentity;
use RuntimeException;

final class AssignmentConflict extends RuntimeException implements CodedRefusal, CommandRefusal, RefusalDetails
{
    use RendersRefusal;

    private function __construct(private readonly RecordIdentity $record, string $message)
    {
        parent::__construct($message);
    }

    public static function heldByAnother(RecordIdentity $record): self
    {
        return new self(
            $record,
            "{$record->type} {$record->id} is held by someone else; read its assignment and reassign it deliberately.",
        );
    }

    public static function staleReference(RecordIdentity $record): self
    {
        return new self(
            $record,
            "The assignment of {$record->type} {$record->id} changed since it was read; read it again.",
        );
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }

    public function refusalDetails(): array
    {
        return ['next_action' => new RecoveryCall('assignments_read', [
            'record_type' => $this->record->type,
            'record_id' => $this->record->id,
        ])->toArray()];
    }

    protected function details(): array
    {
        return $this->refusalDetails();
    }
}
