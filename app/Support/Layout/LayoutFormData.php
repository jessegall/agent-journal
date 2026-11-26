<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Settings\Enums\ActionMethod;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where a layout form sends: one registered action of the reader's own domain with its method, address and unchanged
 * values, whether each submission carries a new Idempotency-Key, the question it asks first, and once accepted the
 * toast's sentence and, when the domain has one, its Undo form.
 */
#[TypeScript]
final class LayoutFormData extends Data
{
    /**
     * @param  array<string, string|int>  $fixed
     */
    public function __construct(
        public readonly ActionMethod $method,
        public readonly string $href,
        public readonly array $fixed = [],
        public readonly bool $isKeyed = false,
        public readonly string|Optional $confirmation = new Optional(),
        public readonly string|Optional $confirmed = new Optional(),
        public readonly self|Optional $undo = new Optional(),
    ) {}
}
