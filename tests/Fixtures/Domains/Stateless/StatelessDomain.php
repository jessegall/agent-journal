<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Stateless;

use App\Concerns\HasStates;
use App\Support\Domain;
use App\Support\Exports;

/**
 * A fixture domain that uses the states trait without declaring states.
 */
final class StatelessDomain extends Domain
{
    use HasStates;

    public function description(): string
    {
        return 'A fixture domain that boots states it never declares.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()->build();
    }
}
