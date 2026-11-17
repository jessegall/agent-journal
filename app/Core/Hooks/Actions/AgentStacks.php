<?php

declare(strict_types=1);

namespace App\Core\Hooks\Actions;

use App\Core\Hooks\Contracts\AgentStack;
use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\Models\AgentStackRow;
use App\Core\Hooks\Stack\StackRestorer;
use App\Core\Hooks\Support\StackAccess;
use App\Core\Agents\Support\StackTarget;
use App\Core\Hooks\Support\StackTransaction;

/**
 * Pushes states onto the calling agent's own stack, always inside the caller's stack transaction and under the stack's row lock.
 */
final readonly class AgentStacks implements AgentStack
{
    public function __construct(
        private StackTransaction $transaction,
        private StackAccess $access,
        private StackRestorer $restorer,
    ) {}

    /**
     * Puts a state on top of the stack in the caller's transaction; a state already on the stack keeps its place.
     */
    public function push(StackTarget $target, StateReference $state): void
    {
        $this->transaction->requireOpen($target);
        $this->access->checkTarget($target);

        $row = AgentStackRow::lockFor($target);
        $stack = $this->restorer->restore($row->frames, $this->access->role())->withStateOnTop($state);

        $row->saveFrames($stack->records());
    }
}
