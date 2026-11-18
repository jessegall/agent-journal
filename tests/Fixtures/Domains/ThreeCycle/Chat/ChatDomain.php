<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\ThreeCycle\Chat;

use App\Domains\Contracts\Domain;
use Tests\Fixtures\Domains\ThreeCycle\Hooks\HooksDomain;

final class ChatDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain in a cycle of three.';
    }

    public function requires(): array
    {
        return [HooksDomain::class];
    }

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [];
    }
}
