<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Leaky;

use App\Actors\Contracts\Actor;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;

final class LeakyDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain that exports a class it does not own.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->contracts(Actor::class)
            ->build();
    }
}
