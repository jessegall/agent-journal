<?php

declare(strict_types=1);

namespace App\Support\Run;

use App\Enums\Runs\PartResultType;

/**
 * One part's result as the journal answers it: receipted with its outcome and receipt, evidence only, or unavailable
 * with the problems that keep it from a result.
 */
final readonly class PartResult
{
    /**
     * @param  list<string>  $problems
     */
    private function __construct(
        public PartResultType $type,
        public string $outcome,
        public string $receiptId,
        public array $problems,
    ) {}

    public static function receipted(string $outcome, string $receiptId): self
    {
        return new self(PartResultType::Receipted, $outcome, $receiptId, []);
    }

    public static function evidenceOnly(): self
    {
        return new self(PartResultType::EvidenceOnly, '', '', []);
    }

    /**
     * @param  list<string>  $problems
     */
    public static function unavailable(array $problems): self
    {
        return new self(PartResultType::Unavailable, '', '', $problems);
    }

    /**
     * @param  array{type: string, outcome: string, receipt_id: string, problems: list<string>}  $answer
     */
    public static function fromAnswer(array $answer): self
    {
        return new self(
            PartResultType::from($answer['type']),
            $answer['outcome'],
            $answer['receipt_id'],
            $answer['problems'],
        );
    }

    /**
     * @return array{type: string, outcome: string, receipt_id: string, problems: list<string>}
     */
    public function toArray(): array
    {
        return [
            'type' => $this->type->value,
            'outcome' => $this->outcome,
            'receipt_id' => $this->receiptId,
            'problems' => $this->problems,
        ];
    }

    /**
     * The result as one line for a user to read.
     */
    public function describe(): string
    {
        return match ($this->type) {
            PartResultType::Receipted => "result {$this->outcome}, receipt {$this->receiptId}",
            PartResultType::EvidenceOnly => 'evidence only',
            PartResultType::Unavailable => 'result unavailable: '.implode(', ', $this->problems),
        };
    }
}
