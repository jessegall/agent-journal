<?php

declare(strict_types=1);

namespace App\Data\Pages;

use App\Navigation\Data\WindowOfferData;
use App\Web\Enums\WindowStatus;
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
        public readonly WindowStatus $status,
        #[MapName('data')]
        public readonly array $windowFields,
        public readonly WindowOfferData|Optional $offer,
    ) {}

    /**
     * @param  array<string, mixed>  $fields
     */
    public static function of(array $fields): self
    {
        return new self(WindowStatus::Ready, $fields, Optional::create());
    }

    /**
     * @param  array<string, mixed>  $fields
     */
    public static function offering(array $fields, WindowOfferData $offer): self
    {
        return new self(WindowStatus::Ready, $fields, $offer);
    }
}
