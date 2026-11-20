<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Exceptions\SupervisorRouteInvalid;

final readonly class AskTypeKey
{
    private function __construct(public string $key) {}

    public static function from(string $key): self
    {
        if ($key === 'default' || preg_match('/^[a-z][a-z0-9]*(?:[.-][a-z][a-z0-9]*)*$/D', $key) !== 1) {
            throw SupervisorRouteInvalid::askType($key);
        }

        return new self($key);
    }
}
