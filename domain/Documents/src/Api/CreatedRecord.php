<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

/**
 * What a create command made: its id, the number people call it by, and whether it is a document or a report.
 */
final readonly class CreatedRecord
{
    public function __construct(
        public string $id,
        public int $number,
        public string $type,
    ) {}

    /**
     * How people name it: doc 12 or report 3.
     */
    public function label(): string
    {
        return "{$this->type} {$this->number}";
    }
}
