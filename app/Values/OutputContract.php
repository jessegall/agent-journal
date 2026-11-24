<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\EmptyPolicy;
use App\Enums\EmptySelection;
use App\Enums\FramingType;
use App\Enums\OutputEncoding;
use App\Enums\StreamUse;
use App\Enums\SummaryRule;

/**
 * What a check's output must look like for its reader to judge it: encoding, framing,
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
     * The contract as a reader names it: its framing, summary rule and empty-run policy.
     */
    public function label(): string
    {
        return "output {$this->framing->value}, summary {$this->summary->value}, empty {$this->empty->policy->value}";
    }

    public function isSummaryRequired(): bool
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

    /**
     * Whether a run that read no record breaks the contract.
     */
    public function allowsEmptySuccess(): bool
    {
        return $this->empty->policy === EmptyPolicy::AllowedSuccess;
    }

    public function isEmptyRefused(): bool
    {
        return $this->empty->policy === EmptyPolicy::Invalid;
    }
}
