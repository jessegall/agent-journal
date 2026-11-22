<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Any record as a link list shows it: its link alias and id, its number and label such as task 12, its title, a
 * short abstract when it has one, and the page that inspects it when its owner has one.
 */
#[TypeScript]
final class RecordCard extends Data
{
    public function __construct(
        public readonly string $type,
        public readonly string $id,
        public readonly string $number,
        public readonly string $label,
        public readonly string $title,
        public readonly string|null $abstract,
        public readonly string|null $route,
    ) {}
}
