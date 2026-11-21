<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use Spatie\LaravelData\Data;

/**
 * Codex's answer to account/login/start for a device-code sign-in: where the user approves it, the code they enter
 * and the id of the login, once it answered.
 */
final class CodexLoginStartData extends Data
{
    public function __construct(
        public readonly string|null $verificationUrl = null,
        public readonly string|null $userCode = null,
        public readonly string|null $loginId = null,
    ) {}
}
