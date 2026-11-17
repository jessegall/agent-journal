<?php

declare(strict_types=1);

namespace Domain\Chat;

use App\Domains\Domain;

final class ChatDomain implements Domain
{
    public function description(): string
    {
        return 'Messages between the user and agents; a question is a kind of message.';
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }
}
