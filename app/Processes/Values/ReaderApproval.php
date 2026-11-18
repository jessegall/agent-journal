<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Contracts\StoredValue;

/**
 * The reader revision and the reader proof a test, check or build rule was approved with (doc 21 revision 6, section
 * 72), so the approval binds that exact reader.
 */
final readonly class ReaderApproval implements StoredValue
{
    public function __construct(public string $readerRevisionId, public string $proofId) {}

    /**
     * @return array{reader_revision_id: string, proof_id: string}
     */
    public function toArray(): array
    {
        return ['reader_revision_id' => $this->readerRevisionId, 'proof_id' => $this->proofId];
    }

    /**
     * @param  array<string, mixed>  $fields  the shape toArray writes
     */
    public static function fromArray(array $fields): self
    {
        return new self($fields['reader_revision_id'], $fields['proof_id']);
    }
}
