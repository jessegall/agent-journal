<?php

declare(strict_types=1);

namespace App\Data\Agents;

use App\Enums\NavigationReason;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A host's report that its replay of a library entry failed a check on a runtime's build: why, at which step, and the
 * redacted screen it failed on.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class MenuEntryStaleData extends Data
{
    /**
     * @param  list<string>  $rows
     */
    public function __construct(
        public readonly string $runtimeId,
        public readonly string $operationKey,
        public readonly NavigationReason $reason,
        public readonly int $step,
        public readonly string $build,
        public readonly array $rows = [],
    ) {}
}
