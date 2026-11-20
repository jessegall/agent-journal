<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

interface RequestKey
{
    public const int LONGEST = 128;

    public function set(string $key): void;

    public function forget(): void;

    /** @param class-string $command */
    public function requireFor(string $command): string;
}
