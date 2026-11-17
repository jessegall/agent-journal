<?php

declare(strict_types=1);

namespace Tests\Fixtures\Declarations\Wrong;

use App\Domain\Domain;

final class WrongDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain holding a misplaced file.';
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
