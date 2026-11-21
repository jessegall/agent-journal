<?php

declare(strict_types=1);

namespace App\Engine\Values;

use App\Agents\Values\StackTarget;
use Carbon\CarbonImmutable;

/**
 * One frame's settled tick: its stack, its frame id and the server time its settled invocation started, written to
 * the microsecond.
 */
final readonly class FrameSettlement
{
    public const string TIME_FORMAT = 'Y-m-d\\TH:i:s.uP';

    public function __construct(
        public StackTarget $target,
        public string $stackId,
        public string $frameId,
        public string $settledAt,
    ) {}

    public static function at(StackTarget $target, string $stackId, string $frameId, CarbonImmutable $settledAt): self
    {
        return new self($target, $stackId, $frameId, $settledAt->format(self::TIME_FORMAT));
    }

    public function settledAt(): CarbonImmutable
    {
        return CarbonImmutable::parse($this->settledAt);
    }
}
