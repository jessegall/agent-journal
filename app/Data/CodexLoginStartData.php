<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;

/**
 * Codex's answer to account/login/start for a device-code sign-in: where the user approves it, the code they enter
 * and the id of the login.
 */
final class CodexLoginStartData extends Data
{
    public function __construct(
        public readonly string $verificationUrl,
        public readonly string $userCode,
        public readonly string $loginId,
    ) {}
}
