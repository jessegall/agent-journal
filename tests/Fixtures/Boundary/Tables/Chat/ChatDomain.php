<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Tables\Chat;

use App\Domain\Domain;

final class ChatDomain implements Domain
{
    public function description(): string
    {
        return 'A fixture domain for the table rules.';
    }

    public function requires(): array
    {
        return [];
    }
}
