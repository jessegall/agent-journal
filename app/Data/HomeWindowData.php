<?php

declare(strict_types=1);

namespace App\Data;

use App\Enums\Icon;
use App\Enums\WindowPlace;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One window Home can show: its pane key in the layouts, its full page key, the optional prop that carries its
 * result, the component the manifest loads, and its title and icon.
 */
#[TypeScript]
final class HomeWindowData extends Data
{
    public function __construct(
        public readonly string $paneKey,
        public readonly string $key,
        public readonly string $propName,
        public readonly string $component,
        public readonly string $title,
        public readonly Icon $icon,
        public readonly WindowPlace|Optional $place = new Optional(),
    ) {}
}
