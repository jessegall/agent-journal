<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use Spatie\LaravelData\Data;

/**
 * The error a failed Codex turn names, such as the provider's refusal of a key.
 */
final class CodexErrorData extends Data
{
    public function __construct(public readonly string $message) {}
}
