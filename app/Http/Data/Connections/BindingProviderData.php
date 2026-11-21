<?php

declare(strict_types=1);

namespace App\Http\Data\Connections;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One program a connected folder could start, as the owner sees it: its name, whether Start is offered for it, the
 * command that starts it in the folder, and the reason it is not offered.
 */
#[TypeScript]
final class BindingProviderData extends Data
{
    public function __construct(
        public readonly string $driver,
        public readonly string $label,
        public readonly bool $canStart,
        public readonly string $startCommand,
        public readonly string $unavailableReason,
    ) {}
}
