<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Shelf;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;

/**
 * A fixture domain for page props; the tests declare its pages and sections themselves.
 */
final class ShelfDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain whose pages test the page props.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }
}
