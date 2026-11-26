<?php

declare(strict_types=1);

namespace App\Support\Compatibility\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Drivers\UnstartableDriver;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Accounts\AuthenticationArrangement;
use App\Enums\Drivers\DriverEvidence;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

/**
 * A pinned driver's way of sharing an account's sign-in is not shown on the real driver, so a start of it ends with
 * this reason instead of running.
 */
final class DriverArrangementUnproven extends RuntimeException implements
    CodedRefusal,
    CommandRefusal,
    UnstartableDriver
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
