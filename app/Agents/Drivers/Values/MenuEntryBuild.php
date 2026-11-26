<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Values;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One driver build a menu entry was proven on, and whether its replay went stale there: why, and the redacted
 *  screen it failed on.
 */
#[MapName(SnakeCaseMapper::class)]
final class MenuEntryBuild extends Data
{
    /**
     * @param  list<string>  $staleScreen
     */
    public function __construct(
        public readonly string $build,
        public readonly bool $isStale,
        public readonly string|null $staleReason,
        public readonly array $staleScreen,
        public readonly CarbonImmutable $provenAt,
    ) {}

    public static function proven(string $build, CarbonImmutable $at): self
    {
        return new self($build, false, null, [], $at);
    }

    /**
     * @param  list<string>  $screen
     */
    public function markedStale(string $reason, array $screen): self
    {
        return new self($this->build, true, $reason, $screen, $this->provenAt);
    }
}
