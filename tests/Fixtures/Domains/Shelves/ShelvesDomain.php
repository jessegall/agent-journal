<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Shelves;

use App\Domains\Domain;

final class ShelvesDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain with a migration and a listener.';
    }

    public function requires(): array
    {
        return [];
    }
}
