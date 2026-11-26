<?php

declare(strict_types=1);

namespace App\Support\Hooks;

use App\Agents\Drivers\Hooks\DriverReply;
use Spatie\LaravelData\Data;

/**
 * The endpoint's answer to the host: what the driver's hook prints, on which stream, and its exit code.
 */
final class HookResponse extends Data
{
    public function __construct(
        public readonly string $stdout,
        public readonly string $stderr,
        public readonly int $exitCode,
    ) {}

    public static function fromDriverReply(DriverReply $reply): self
    {
        return new self($reply->stdout, $reply->stderr, $reply->exitCode);
    }
}
