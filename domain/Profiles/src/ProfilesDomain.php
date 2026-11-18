<?php

declare(strict_types=1);

namespace Domain\Profiles;

use App\Domains\Support\Domain;

final class ProfilesDomain extends Domain
{
    public function description(): string
    {
        return 'Agent definitions: the program, the model and the instructions an agent starts with.';
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
