<?php

declare(strict_types=1);

namespace App\Hooks\Compatibility\Exceptions;

use App\Agents\Contracts\UnstartableProgram;
use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A pinned program's build cannot start in this container at all: a contained host reported its protection and the
 * report leaves items unenforced, so a start of it ends with this reason instead of waiting to be claimed.
 */
final class DriverUnstartableInContainer extends RuntimeException implements
    CodedRefusal,
    CommandRefusal,
    UnstartableProgram
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
