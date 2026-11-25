<?php

declare(strict_types=1);

namespace Domain\Documents\Values;

use Domain\Documents\Enums\AttentionStatus;

/**
 * Identifies a report and its state in a read result.
 */
final readonly class ReportReadCard
{
    public function __construct(public int $number, public string $id, public AttentionStatus $state) {}

    /**
     * @return array{report_id: int, record_id: string, state: string}
     */
    public function toArray(): array
    {
        return [
            'report_id' => $this->number,
            'record_id' => $this->id,
            'state' => $this->state->value,
        ];
    }
}
