<?php

declare(strict_types=1);

namespace Tests\Fixtures\Declarations\Deep\Inner;

use App\Domains\Support\Domain;

final class InnerDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain one level too deep.';
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
