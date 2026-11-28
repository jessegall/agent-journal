<?php

declare(strict_types=1);

namespace App\Bus\Values;

final readonly class ListenerRun
{
    public function __construct(public string $listener, public object $event) {}

    public function listenerClass(): string
    {
        return explode('@', $this->listener, 2)[0];
    }
}
