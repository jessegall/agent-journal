<?php

declare(strict_types=1);

namespace App\Domain\Hooks;

use App\Domain\Hooks\Decisions\NoSubject;
use App\Domain\Hooks\Decisions\StateReference;
use App\Domain\Hooks\Models\AgentStackRow;
use App\Domain\Hooks\States\ReadyStateType;
use App\Domain\Hooks\Storage\FrameRecord;
use App\Domain\Hooks\Storage\FrameRecords;
use App\Domain\Hooks\Storage\StackTarget;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;

/**
 * Opens and closes the stack of a launch. Only a launch does this, so it reads the stack through the explicit
 * authorized query instead of the calling agent's own.
 */
final readonly class LaunchStacks
{
    public function __construct(private StackTransaction $transaction) {}

    /**
     * Opens the stack with the bottom state of the role, or leaves the one a racing launch opened first.
     */
    public function open(StackTarget $target, ReadyStateType $role): void
    {
        $this->transaction->requireOpen($target);

        AgentStackRow::insertIfMissing($target, new FrameRecords([
            new FrameRecord((string) Str::ulid(), new StateReference($role->value, NoSubject::None), true, $role->schemaVersion()),
        ]));

        AgentStackRow::lockForLaunch($target)->frames->checkBottomFor($role);
    }

    public function close(StackTarget $target): void
    {
        $this->transaction->requireOpen($target);

        AgentStackRow::lockForLaunch($target)->closeAt(CarbonImmutable::now());
    }
}
