<?php

declare(strict_types=1);

namespace App\Hooks\Compatibility\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use App\Hooks\Enums\AuthenticationArrangement;
use App\Hooks\Enums\DriverEvidence;
use RuntimeException;

/**
 * A pinned driver's way of sharing an account's sign-in is not shown on the real driver, so no start uses it.
 */
final class DriverArrangementUnproven extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(
        string $driver,
        string $version,
        AuthenticationArrangement $arrangement,
        DriverEvidence $evidence,
        string $owner,
    ): self {
        return new self(
            "{$driver} {$version} starts on an account as {$arrangement->value}, which is {$evidence->value}; "
            ."{$owner} shows it on the real driver before an agent may start this way.",
        );
    }

    public static function inContainer(string $driver, string $version, string $shortfall): self
    {
        return new self("{$driver} {$version} cannot start in a container: {$shortfall}.");
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}
