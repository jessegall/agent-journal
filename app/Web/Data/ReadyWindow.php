<?php

declare(strict_types=1);

namespace App\Web\Data;

use App\Web\Enums\WindowState;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A window whose reader answered: the reader's Data, already serialized inside the window's own boundary.
 */
#[TypeScript]
final class ReadyWindow extends Data
{
    /**
     * @param  array<string, mixed>  $windowFields
     */
    public function __construct(
        public readonly WindowState $state,
        #[MapName('data')]
        public readonly array $windowFields,
    ) {}

    /**
     * @param  array<string, mixed>  $windowFields
     */
    public static function of(array $windowFields): self
    {
        return new self(WindowState::Ready, $windowFields);
    }
}
