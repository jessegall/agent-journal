<?php

declare(strict_types=1);

namespace App\Connections;

final readonly class ConnectionCursors
{
    public function __construct(public string|null $attempts, public string|null $bindings) {}
}
