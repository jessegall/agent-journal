<?php

declare(strict_types=1);

namespace App\Notifications\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Which page of the bell's notifications is read: the newest without a cursor, an older one by its cursor.
 */
#[TypeScript]
final class NotificationPageInput extends Data
{
    public function __construct(public readonly string|null $cursor = null) {}
}
