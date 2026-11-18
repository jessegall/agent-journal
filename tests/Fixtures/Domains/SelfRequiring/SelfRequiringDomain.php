<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\SelfRequiring;

use App\Domains\Support\Domain;

final class SelfRequiringDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain that requires itself.';
    }

    public function requires(): array
    {
        return [self::class];
    }

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [];
    }
}
