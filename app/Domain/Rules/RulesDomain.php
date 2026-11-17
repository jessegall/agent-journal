<?php

declare(strict_types=1);

namespace App\Domain\Rules;

use App\Domain\Domain;

final class RulesDomain implements Domain
{
    public function description(): string
    {
        return 'The standing project rules every agent is told.';
    }

    /**
     * @return list<class-string<Domain>>
     */
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
