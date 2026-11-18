<?php

declare(strict_types=1);

namespace Tests\Fixtures\Declarations\Wrong;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;

final class WrongDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain holding a misplaced file.';
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
