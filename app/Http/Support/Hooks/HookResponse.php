<?php

declare(strict_types=1);

namespace App\Http\Support\Hooks;

use App\Hooks\Drivers\DriverReply;
use Spatie\LaravelData\Data;

/**
 * The endpoint's answer to the host: what the program's hook prints, on which stream, and its exit code.
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
