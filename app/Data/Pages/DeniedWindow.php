<?php

declare(strict_types=1);

namespace App\Data\Pages;

use App\Enums\Web\WindowState;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A window the signed-in user may not see: no reader ran and no earlier rows are kept.
 */
#[TypeScript]
final class DeniedWindow extends Data
{
    public function __construct(public readonly WindowState $state) {}

    public static function make(): self
    {
        return new self(WindowState::Denied);
    }
}
