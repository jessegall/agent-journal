<?php

declare(strict_types=1);

namespace App\Supervision\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Contracts\CommandRefusal;
use RuntimeException;

final class SupervisorRouteRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    /**
     * @param  list<string>  $path
     */
    public static function cycle(string $route, array $path): self
    {
        return new self("The {$route} supervisor route has a cycle: ".implode(' → ', $path).'.');
    }

    /**
     * @param  list<string>  $path
     */
    public static function tooDeep(string $route, array $path): self
    {
        return new self("The {$route} supervisor route exceeds 32 hops: ".implode(' → ', $path).'.');
    }

    public static function stale(int $expected, int $current): self
    {
        return new self("The supervisor route is at version {$current}; the change expected {$expected}.");
    }

    public static function actorUnavailable(): self
    {
        return new self('The actor has no supervisor route to change.');
    }

    public static function historyEdited(): self
    {
        return new self('A recorded supervisor change is immutable.');
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }
}
