<?php

declare(strict_types=1);

namespace App\Data\Notifications;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The cursor the notification changes are read since.
 */
#[TypeScript]
final class NotificationChangesInput extends Data
{
    public function __construct(public readonly string $since) {}
}
