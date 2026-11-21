<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Contracts\StoredValue;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The reader revision and the reader proof a test, check or build rule was approved with (doc 21 revision 6, section
 * 72), so the approval binds that exact reader.
 */
#[MapName(SnakeCaseMapper::class)]
final class ReaderApproval extends Data implements StoredValue
{
    public function __construct(
        public readonly string $readerRevisionId,
        public readonly string $proofId,
    ) {}

    public static function fromJson(string $json): self
    {
        return ReaderApproval::from(json_decode($json, true, flags: JSON_THROW_ON_ERROR));
    }

    public static function listFromJson(string $json): array
    {
        return array_values(ReaderApproval::collect(json_decode($json, true, flags: JSON_THROW_ON_ERROR)));
    }
}
