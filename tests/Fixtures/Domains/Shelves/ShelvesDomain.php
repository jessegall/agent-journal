<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Shelves;

use App\Support\Domain;
use App\Support\Exports;
use Domain\Comments\CommentsDomain;

final class ShelvesDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain with a migration and a listener.';
    }

    public function requires(): array
    {
        return [CommentsDomain::class];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }
}
