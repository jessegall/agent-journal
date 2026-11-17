<?php

declare(strict_types=1);

namespace App\Core\Web\Data;

use App\Core\Web\Enums\WindowState;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A window whose reader answered: the reader's Data, already serialized inside the window's own boundary.
 */
#[TypeScript]
final class ReadyWindow extends Data
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function __construct(
        public readonly WindowState $state,
        public readonly array $data,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function of(array $data): self
    {
        return new self(WindowState::Ready, $data);
    }
}
