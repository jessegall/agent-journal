<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Leaky;

use App\Domains\Contracts\Domain;
use App\Actors\Contracts\Actor;

final class LeakyDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain that exports a class it does not own.';
    }

    public function requires(): array
    {
        return [];
    }

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [Actor::class];
    }
}
