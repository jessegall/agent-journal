<?php

declare(strict_types=1);

namespace App\Values;

use App\CommandRules\Enums\EmptyPolicy;
use App\CommandRules\Enums\EmptySelection;
use App\CommandRules\Enums\FramingType;
use App\CommandRules\Enums\OutputEncoding;
use App\CommandRules\Enums\StreamUse;
use App\CommandRules\Enums\SummaryRule;
use App\CommandRules\Values\EmptyRunPolicy;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * What a check's output must look like for its reader to judge it: encoding, framing,
 * schema versions, whether its streams may be merged, whether it must end with a summary, and what an empty output or
 * an empty selection means.
 */
#[MapName(SnakeCaseMapper::class)]
final class OutputContract extends Data
{
    public function __construct(
        public readonly OutputEncoding $encoding,
        public readonly FramingType $framing,
        public readonly string $schemaVersions,
        public readonly StreamUse $streams,
        public readonly SummaryRule $summary,
        public readonly EmptyRunPolicy $empty,
        public readonly EmptySelection $emptySelection,
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
