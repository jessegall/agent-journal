<?php

declare(strict_types=1);

namespace App\Hooks\Readers;

use App\Actors\Support\ActorIdentity;
use App\Agents\Values\WorkReference;
use App\Hooks\Contracts\WorkProgress;
use App\Hooks\Models\AgentStackRow;
use Carbon\CarbonImmutable;

final readonly class FrameProgress implements WorkProgress
{
    public function enteredAt(ActorIdentity $actor, WorkReference $work): CarbonImmutable|null
    {
        if (! $actor->type->isAgent()) {
            return null;
        }

        $entered = null;
        AgentStackRow::query()->historyOf($actor)->readInChunks(50, function ($stacks) use ($work, &$entered): void {
            foreach ($stacks as $stack) {
                $found = $stack->frames->entryFor($work);

                if ($found !== null && ($entered === null || $found->lessThan($entered))) {
                    $entered = $found;
                }
            }
        });

        return $entered;
    }
}
