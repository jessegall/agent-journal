<?php

declare(strict_types=1);

namespace App\Support\Stored;

use App\Enums\EmptySelection;
use App\Enums\FramingType;
use App\Enums\OutputEncoding;
use App\Enums\StreamUse;
use App\Enums\SummaryRule;
use App\Values\OutputContract;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * What a check's output must look like, as a stored contract holds it.
 */
#[MapName(SnakeCaseMapper::class)]
final class StoredOutputContract extends Data
{
    public function __construct(
        public readonly OutputEncoding $encoding,
        public readonly FramingType $framing,
        public readonly string $schemaVersions,
        public readonly StreamUse $streams,
        public readonly SummaryRule $summary,
        public readonly StoredEmptyRunPolicy $empty,
        public readonly EmptySelection $emptySelection,
    ) {}

    public static function fromOutputContract(OutputContract $output): self
    {
        return self::from([
            'encoding' => $output->encoding,
            'framing' => $output->framing,
            'schema_versions' => $output->schemaVersions,
            'streams' => $output->streams,
            'summary' => $output->summary,
            'empty' => StoredEmptyRunPolicy::fromEmptyRunPolicy($output->empty),
            'empty_selection' => $output->emptySelection,
        ]);
    }

    public function toOutputContract(): OutputContract
    {
        return new OutputContract(
            $this->encoding,
            $this->framing,
            $this->schemaVersions,
            $this->streams,
            $this->summary,
            $this->empty->toEmptyRunPolicy(),
            $this->emptySelection,
        );
    }
}
