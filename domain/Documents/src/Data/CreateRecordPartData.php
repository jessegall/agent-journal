<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The props of the form that files a new document or report: the route it posts to and its button's label.
 */
#[TypeScript]
final class CreateRecordPartData extends Data
{
    public function __construct(
        public readonly string $action,
        public readonly string $label,
    ) {}
}
