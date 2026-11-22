<?php

declare(strict_types=1);

namespace App\Ui\Layout;

use App\Ui\Enums\ActionMethod;
use App\Ui\Enums\Icon;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One item of a menu, bound to the record the menu was opened on: its full key, its label, the address it opens or
 * sends to, and GET for a page it opens or the method of the action it sends.
 */
#[TypeScript]
final class LayoutMenuItemData extends Data
{
    public function __construct(
        public readonly string $key,
        public readonly string $label,
        public readonly string $href,
        public readonly ActionMethod $method,
        public readonly Icon|Optional $icon = new Optional(),
    ) {}
}
