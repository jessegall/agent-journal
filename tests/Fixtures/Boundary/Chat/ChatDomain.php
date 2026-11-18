<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Chat;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;

final class ChatDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain that requires nothing.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }
}
