<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\AlwaysOn;

use App\Support\Domain;
use App\Support\Exports;
use Tests\Fixtures\Domains\Books\BooksDomain;

/**
 * A fixture domain that can never be switched off yet requires Books, which can.
 */
final class AlwaysOnDomain extends Domain
{
    public function description(): string
    {
        return 'A fixture domain that is always on and requires a domain that can be switched off.';
    }

    public function requires(): array
    {
        return [BooksDomain::class];
    }

    public function canDisable(): bool
    {
        return false;
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->build();
    }
}
