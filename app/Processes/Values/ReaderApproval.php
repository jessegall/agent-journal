<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Contracts\StoredValue;
use App\Processes\Stored\StoredReaderApproval;

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

    public static function fromJson(string $json): self
    {
        return StoredReaderApproval::from(json_decode($json, true, flags: JSON_THROW_ON_ERROR))->approval();
    }

    public static function listFromJson(string $json): array
    {
        return array_values(array_map(
            fn (StoredReaderApproval $stored) => $stored->approval(),
            StoredReaderApproval::collect(json_decode($json, true, flags: JSON_THROW_ON_ERROR)),
        ));
    }
}
