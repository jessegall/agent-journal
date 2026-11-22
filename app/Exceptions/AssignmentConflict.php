<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Contracts\Refusals\RefusalDetails;
use App\Enums\RefusalCode;
use App\Support\RecordIdentity;
use App\Values\RecoveryCall;
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

    /**
     * @return array<string, mixed>
     */
    protected function details(): array
    {
        return $this->refusalDetails();
    }
}
