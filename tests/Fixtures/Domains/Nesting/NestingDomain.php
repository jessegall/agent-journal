<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Nesting;

use App\Domain\Domain;

final class NestingDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain another one sits inside.';
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
        return [];
    }
}
