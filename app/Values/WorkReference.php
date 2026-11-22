<?php

declare(strict_types=1);

namespace App\Values;

use App\Support\RecordIdentity;

final readonly class WorkReference
{
    public function __construct(public string $key) {}

    public static function free(string $chain): self
    {
        return new self('free:'.$chain);
    }

    public static function forRecord(RecordIdentity $record): self
    {
        return new self($record->type.':'.$record->id);
    }

    public function isFree(): bool
    {
        return str_starts_with($this->key, 'free:');
    }
}
