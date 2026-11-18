<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Chat;

use App\Domains\Contracts\Domain;

final class ChatDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain that raises MessageSent.';
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
