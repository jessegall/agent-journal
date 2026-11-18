<?php

declare(strict_types=1);

namespace App\Hooks\Actions;

use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\CurrentState;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\StackRestorer;
use PhpOption\None;
use PhpOption\Option;

/**
 * Reads a stack's current state of a type from the top down, without a lock and without writing.
 */
final readonly class CurrentStates implements CurrentState
{
    public function __construct(private StackRestorer $restorer) {}

    public function of(StackTarget $target, string $typeKey): Option
    {
        return AgentStackRow::activeFor($target)->flatMap(function (AgentStackRow $row) use ($typeKey): Option {
            foreach (array_reverse($this->restorer->restore($row->frames, $row->frames->role())->frames()) as $frame) {
                if ($frame->typeKey() === $typeKey && ! $frame->isFinished()) {
                    return Option::fromValue($frame->reference);
                }
            }

            return None::create();
        });
    }
}
