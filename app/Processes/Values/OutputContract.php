<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\EmptySelection;
use App\Processes\Enums\FramingType;
use App\Processes\Enums\OutputEncoding;
use App\Processes\Enums\StreamUse;
use App\Processes\Enums\SummaryRule;

/**
 * What a check's output must look like for its reader to judge it (doc 21 revision 6, section 68): encoding, framing,
 * schema versions, whether its streams may be merged, whether it must end with a summary, and what an empty output or
 * an empty selection means.
 */
final readonly class OutputContract
{
    public function __construct(
        public OutputEncoding $encoding,
        public FramingType $framing,
        public string $schemaVersions,
        public StreamUse $streams,
        public SummaryRule $summary,
        public EmptyRunPolicy $empty,
        public EmptySelection $emptySelection,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'encoding' => $this->encoding->value,
            'framing' => $this->framing->value,
            'schema_versions' => $this->schemaVersions,
            'streams' => $this->streams->value,
            'summary' => $this->summary->value,
            'empty' => $this->empty->toArray(),
            'empty_selection' => $this->emptySelection->value,
        ];
    }

    /**
     * @param  array<string, mixed>  $fields  the shape toArray writes
     */
    public static function fromArray(array $fields): self
    {
        return new self(
            OutputEncoding::from($fields['encoding']),
            FramingType::from($fields['framing']),
            $fields['schema_versions'],
            StreamUse::from($fields['streams']),
            SummaryRule::from($fields['summary']),
            EmptyRunPolicy::fromArray($fields['empty']),
            EmptySelection::from($fields['empty_selection']),
        );
    }

    /**
     * The contract as a reader names it: its framing, summary rule and empty-run policy.
     */
    public function label(): string
    {
        return "output {$this->framing->value}, summary {$this->summary->value}, empty {$this->empty->policy->value}";
    }

    public function requiresSummary(): bool
    {
        return $this->summary === SummaryRule::RequiredTerminalRecord;
    }

    /**
     * Plain text lines on merged streams with no promised summary: the contract of a check whose reader is not proven.
     */
    public static function plainLines(): self
    {
        return new self(
            OutputEncoding::Utf8,
            FramingType::Lines,
            '*',
            StreamUse::MergeAllowed,
            SummaryRule::NotRequired,
            EmptyRunPolicy::invalid(),
            EmptySelection::ConfigurationProblem,
        );
    }
}
