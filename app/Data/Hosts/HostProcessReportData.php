<?php

declare(strict_types=1);

namespace App\Data\Hosts;

use App\Enums\Hosts\HostProcessReportType;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A host's report that one of its processes started, was started again after a crash, exited or was lost.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class HostProcessReportData extends Data
{
    public function __construct(
        public readonly HostProcessReportType $report,
        public readonly string $identity = '',
        public readonly int $generation = 0,
        public readonly int|null $exitCode = null,
        public readonly string|null $signal = null,
        public readonly string $evidence = '',
    ) {}
}
