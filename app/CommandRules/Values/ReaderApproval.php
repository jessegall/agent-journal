<?php

declare(strict_types=1);

namespace App\CommandRules\Values;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The reader revision and the reader proof a test, check or build rule was approved with, so the approval binds that exact reader.
 */
#[MapName(SnakeCaseMapper::class)]
final class ReaderApproval extends Data
{
    public function __construct(public readonly string $readerRevisionId, public readonly string $proofId) {}

}
