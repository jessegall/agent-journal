<?php

declare(strict_types=1);

namespace App\Agents\Values;

use Spatie\LaravelData\Data;

/**
 * One step of a menu library entry: the fingerprint of the screen it expects, and what it does there, a label to
 * choose when the main agent confirmed a menu entry or else a named key, with the text that proves it when it has
 * one. Arrow presses and screen text are never stored.
 */
final class MenuStep extends Data
{
    public function __construct(
        public readonly string $fingerprint,
        public readonly string|null $choose,
        public readonly string|null $key,
        public readonly string|null $proof,
    ) {}
}
