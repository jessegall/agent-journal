<?php

declare(strict_types=1);

namespace App\Support\Compatibility\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Drivers\UnstartableDriver;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A pinned driver's build cannot start in this container at all: a contained host reported its protection and the
 * report leaves items unenforced, so a start of it ends with this reason instead of waiting to be claimed.
 */
final class DriverUnstartableInContainer extends RuntimeException implements
    CodedRefusal,
    CommandRefusal,
    UnstartableDriver
{
    use RendersRefusal;

    public static function for(string $driver, string $version, string $shortfall): self
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
