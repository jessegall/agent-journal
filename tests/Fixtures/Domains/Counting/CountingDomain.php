<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Counting;

use App\Concerns\HasStates;
use App\Contracts\Records\StateProvider;
use App\Support\Domain;
use App\Support\Exports;
use Tests\Fixtures\Domains\Counting\States\CountFactsState;

/**
 * A fixture domain whose one state counts the facts of its subject, so a test sees a fact reach a state's frame.
 */
final class CountingDomain extends Domain implements StateProvider
{
    use HasStates;

    public function description(): string
    {
        return 'A fixture domain whose state counts the facts it hears.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()->build();
    }

    public function states(): array
    {
        return [CountFactsState::class];
    }
}
