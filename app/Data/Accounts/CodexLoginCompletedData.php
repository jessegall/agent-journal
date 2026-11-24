<?php

declare(strict_types=1);

namespace App\Data\Accounts;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;

/**
 * The params of Codex's account/login/completed notification: which login completed, and whether it succeeded.
 */
final class CodexLoginCompletedData extends Data
{
    public function __construct(
        public readonly string|null $loginId = null,
        #[MapInputName('success')]
        public readonly bool $hasSucceeded = false,
    ) {}
}
