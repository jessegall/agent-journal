<?php

declare(strict_types=1);

namespace App\Support\Recordings;

use App\Hooks\Enums\HookEvent;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Optional;

#[MapInputName(SnakeCaseMapper::class)]
final class RecordedHook extends Data
{
    public function __construct(
        public readonly string|Optional $hookEventName = new Optional(),
        public readonly string|Optional $source = new Optional(),
    ) {}

    public function isSessionStartFrom(string $source): bool
    {
        return $this->hookEventName === HookEvent::SessionStart->value && $this->source === $source;
    }
}
