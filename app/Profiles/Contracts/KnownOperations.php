<?php

declare(strict_types=1);

namespace App\Profiles\Contracts;

/**
 * The operation names trusted owners declare; a profile may grant, remove or deny only these.
 */
interface KnownOperations
{
    public function has(string $operation): bool;
}
