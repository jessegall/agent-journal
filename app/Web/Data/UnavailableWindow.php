<?php

declare(strict_types=1);

namespace App\Web\Data;

use App\Web\Enums\WindowState;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A window whose record is missing or outside the user's scope, which read the same, so it reveals nothing; no
 * earlier rows are kept.
 */
#[TypeScript]
final class UnavailableWindow extends Data
{
    public function __construct(public readonly WindowState $state) {}

    public static function make(): self
    {
        return new self(WindowState::Unavailable);
    }
}
