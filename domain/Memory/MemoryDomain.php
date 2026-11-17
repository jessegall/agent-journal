<?php

declare(strict_types=1);

namespace Domain\Memory;

use App\Domains\Domain;

final class MemoryDomain implements Domain
{
    public function description(): string
    {
        return 'The weighted memories each agent keeps past its context window.';
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }
}
