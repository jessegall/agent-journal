<?php

declare(strict_types=1);

namespace App\Domain\Access;

use App\Domain\Domain;

final class AccessDomain implements Domain
{
    public function description(): string
    {
        return 'The people who sign in, how they sign in, and which of them may use the journal.';
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }
}
