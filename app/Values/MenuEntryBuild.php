<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\Settings\StoredValue;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One driver build a menu entry was proven on, and whether its replay went stale there: why, and the redacted
 * screen it failed on.
 *
 * @method static array<int, static> collect(mixed $items) read only from decoded JSON, so always an array
 */
#[MapName(SnakeCaseMapper::class)]
final class MenuEntryBuild extends Data implements StoredValue
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

    public static function fromJson(string $json): static
    {
        return MenuEntryBuild::from(json_decode($json, true, flags: JSON_THROW_ON_ERROR));
    }

    public static function listFromJson(string $json): array
    {
        return array_values(MenuEntryBuild::collect(json_decode($json, true, flags: JSON_THROW_ON_ERROR)));
    }
}
