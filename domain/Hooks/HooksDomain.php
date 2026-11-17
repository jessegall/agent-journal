<?php

declare(strict_types=1);

namespace Domain\Hooks;

use App\Domains\Domain;

final class HooksDomain implements Domain
{
    public function description(): string
    {
        return 'Turns each hook call of an agent program into hook input and returns the answer.';
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }
}
