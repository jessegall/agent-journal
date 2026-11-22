<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\ThreeCycle\Chat;

use App\Support\Domain;
use App\Support\Exports;
use Tests\Fixtures\Domains\ThreeCycle\Hooks\HooksDomain;

final class ChatDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain in a cycle of three.';
    }

    public function requires(): array
    {
        return [HooksDomain::class];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }
}
