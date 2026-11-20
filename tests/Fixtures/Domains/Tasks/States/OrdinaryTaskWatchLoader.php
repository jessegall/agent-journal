<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States;

final class OrdinaryTaskWatchLoader extends TaskWatchLoader
{
    public function stateClass(): string
    {
        return OrdinaryTaskWatchState::class;
    }
}
