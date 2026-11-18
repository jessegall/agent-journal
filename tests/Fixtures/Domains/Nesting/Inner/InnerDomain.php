<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Nesting\Inner;

use App\Domains\Contracts\Domain;

final class InnerDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain inside the folder and namespace of another domain.';
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
