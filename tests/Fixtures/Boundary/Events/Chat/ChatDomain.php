<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Chat;

use App\Support\Domain;
use App\Support\Exports;

final class ChatDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain that raises MessageSent.';
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
