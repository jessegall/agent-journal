<?php

declare(strict_types=1);

namespace App\Ui\Layout;

use App\Ui\Enums\ActionMethod;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where a layout form sends: one registered action of the reader's own domain, by its method and the address the
 * reader resolved for its record, with the values the form sends unchanged, such as the revision it read. The owning
 * command checks the record, the actor and its state again when it runs.
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
    ) {}
}
