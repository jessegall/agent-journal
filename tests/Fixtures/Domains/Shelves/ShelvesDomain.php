<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Shelves;

use App\Exports\Support\Exports;
use App\Domains\Support\Domain;

final class ShelvesDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain with a migration and a listener.';
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
