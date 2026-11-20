<?php

declare(strict_types=1);

namespace Domain\Documents\Values;

/**
 * Identifies a published document and its revision in a read result.
 */
final readonly class DocumentReadCard
{
    public function __construct(public int $number, public string $id, public int $revision) {}

    /**
     * @return array{doc_id: int, document_id: string, revision: int}
     */
    public function toArray(): array
    {
        return ['doc_id' => $this->number, 'document_id' => $this->id, 'revision' => $this->revision];
    }
}
