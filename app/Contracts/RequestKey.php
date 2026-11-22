<?php

declare(strict_types=1);

namespace App\Contracts;

interface RequestKey
{
    public const int LONGEST = 128;

    public function set(string $key): void;

    public function forget(): void;

    /**
     * The key of this request's write, or null when the call carries none.
     */
    public function key(): string|null;

    /**
     * @param  class-string  $command
     */
    public function requireFor(string $command): string;
}
