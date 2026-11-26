<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;

/**
 * What `claude auth status --json` prints, the fields the journal reads.
 */
final class ClaudeStatusData extends Data
{
    public function __construct(
        #[MapInputName('loggedIn')]
        public readonly bool $isLoggedIn = false,
        public readonly string|null $authMethod = null,
        public readonly string|null $configDirectory = null,
        public readonly string|null $email = null,
        public readonly string|null $loginExpiresAt = null,
    ) {}
}
