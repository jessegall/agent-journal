<?php

declare(strict_types=1);

namespace App\Domain\Hooks;

use App\Domain\Hooks\Decisions\NoSubject;
use App\Domain\Hooks\Decisions\StateReference;
use App\Domain\Hooks\Models\AgentStackRow;
use App\Domain\Hooks\Stack\StackRestorer;
use App\Domain\Hooks\States\ReadyStateType;
use App\Domain\Hooks\Storage\FrameRecord;
use App\Domain\Hooks\Storage\FrameRecords;
use App\Domain\Hooks\Storage\StackTarget;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Str;

/**
 * Creates an agent's stack and pushes states onto it, always inside the caller's stack transaction and under the stack's row lock.
 */
final readonly class AgentStacks
{
    public function __construct(
        private ConnectionInterface $database,
        private StackAccess $access,
        private StackRestorer $restorer,
    ) {}

    /**
     * Creates the stack with the bottom state of the role, or leaves the one a racing launch created first.
     */
    public function create(StackTarget $target, ReadyStateType $role): void
    {
        $this->requireTransaction($target);
        $this->access->checkTarget($target);

        AgentStackRow::insertIfMissing($target, new FrameRecords([
            new FrameRecord((string) Str::ulid(), new StateReference($role->value, NoSubject::None), true, $role->schemaVersion()),
        ]));

        AgentStackRow::lockFor($target)->frames->checkBottomFor($role);
    }

    /**
     * Puts a state on top of the stack in the caller's transaction; a state already on the stack keeps its place.
     */
    public function push(StackTarget $target, StateReference $state): void
    {
        $this->requireTransaction($target);
        $this->access->checkTarget($target);

        $row = AgentStackRow::lockFor($target);
        $stack = $this->restorer->restore($row->frames, $this->access->role())->withStateOnTop($state);

        $row->saveFrames($stack->records());
    }

    private function requireTransaction(StackTarget $target): void
    {
        if ($this->database->transactionLevel() === 0) {
            throw StackTransactionRequired::forTarget($target);
        }
    }
}
