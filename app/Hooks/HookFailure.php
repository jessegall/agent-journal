<?php

declare(strict_types=1);

namespace App\Hooks;

use Spatie\LaravelData\Data;

/**
 * Why the endpoint did not answer a hook call.
 */
final class HookFailure extends Data
{
    public function __construct(public readonly string $message) {}
}
