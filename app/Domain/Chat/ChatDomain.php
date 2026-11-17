<?php

declare(strict_types=1);

namespace App\Domain\Chat;

use App\Domain\Domain;
use App\Domain\Hooks\HooksDomain;
use App\Domain\Links\LinksDomain;

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
        return [HooksDomain::class, LinksDomain::class];
    }
}
