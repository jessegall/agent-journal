<?php

declare(strict_types=1);

namespace App\Http\Data\Agents;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A host's report that its replay of a library entry worked: on which runtime, under the replay's operation key.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class EntryReplayedData extends Data
{
    public function __construct(
        public readonly string $runtimeId,
        public readonly string $operationKey,
    ) {}
}
