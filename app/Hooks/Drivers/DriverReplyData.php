<?php

declare(strict_types=1);

namespace App\Hooks\Drivers;

use Spatie\LaravelData\Data;

/**
 * The body the journal answers a hook call with: the program's standard output, standard error and exit code.
 */
final class DriverReplyData extends Data
{
    public function __construct(
        public readonly string $stdout,
        public readonly string $stderr,
        public readonly int $exitCode,
    ) {}

    public function reply(): DriverReply
    {
        return new DriverReply($this->stdout, $this->stderr, $this->exitCode);
    }
}
