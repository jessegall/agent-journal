<?php

declare(strict_types=1);

namespace App\Values;

use App\Sessions\Enums\StopConditionResultType;

/**
 * One stop condition's result as an inspection shows it: its label, how it ended, how long it took and the safe
 * guidance it left; never its raw output.
 */
final readonly class StopConditionResultLine
{
    public function __construct(
        public string $label,
        public StopConditionResultType $status,
        public int|null $durationMilliseconds,
        public int|null $exitCode,
        public string|null $signal,
        public bool $isTruncated,
        public string $guidance,
    ) {}
}
