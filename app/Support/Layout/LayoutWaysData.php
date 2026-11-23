<?php

declare(strict_types=1);

namespace App\Support\Layout;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The words of the two other ways to make a record that a split button's menu offers: the plain way, such as Write it
 * yourself, and the way with an agent, such as Plan it with an agent; the dialog's own footer names the way with an
 * agent too, and its opener is drawn as a split button only in a page header.
 */
#[TypeScript]
final class LayoutWaysData extends Data
{
    public function __construct(
        public readonly string $plain,
        public readonly string $guided,
        public readonly bool $isInHeader = false,
    ) {}
}
