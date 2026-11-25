<?php

declare(strict_types=1);

namespace App\Support\Readers;

use App\Contracts\Work\WorkProgress as WorkProgressContract;
use App\Models\Agents\AgentStackRow;
use App\Support\ActorReference;
use App\Values\WorkReference;
use Carbon\CarbonImmutable;

final readonly class WorkProgress implements WorkProgressContract
{
    public function enteredAt(ActorReference $actor, WorkReference $work): CarbonImmutable|null
    {
        if (! $actor->isAgent()) {
            return null;
        }

        $earliestEntry = null;

        AgentStackRow::query()->historyOf($actor)->readInChunks(
            50,
            function ($stacks) use ($work, &$earliestEntry): void {
                foreach ($stacks as $stack) {
                    $entry = $stack->frames->entryFor($work);

                    if ($entry !== null && ($earliestEntry === null || $entry->lessThan($earliestEntry))) {
                        $earliestEntry = $entry;
                    }
                }
            },
        );

        return $earliestEntry;
    }
}
