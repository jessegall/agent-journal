<?php

declare(strict_types=1);

namespace App\Data;

use App\Enums\WindowState;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
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
        public readonly DockOfferData|Optional $dockOffer,
    ) {}

    /**
     * @param  array<string, mixed>  $fields
     */
    public static function of(array $fields): self
    {
        return new self(WindowState::Ready, $fields, Optional::create());
    }

    /**
     * @param  array<string, mixed>  $fields
     */
    public static function offering(array $fields, DockOfferData $offer): self
    {
        return new self(WindowState::Ready, $fields, $offer);
    }
}
