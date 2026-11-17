<?php

declare(strict_types=1);

namespace App\Core\Hooks\Stack;

use App\Core\Hooks\Exceptions\StateSchemaUnknown;
use App\Core\Hooks\States\ReadyStateType;
use App\Core\Hooks\Storage\FrameRecord;
use App\Core\Hooks\Storage\FrameRecords;

/**
 * Rebuilds an agent's stack from its stored frames: one bottom state of the agent's role, every state read fresh, finished ones removed.
 */
final readonly class StackRestorer
{
    public function __construct(
        private StateTypes $types,
        private StateFactory $factory,
    ) {}

    public function restore(FrameRecords $records, ReadyStateType $role): AgentStack
    {
        $records->checkBottomFor($role);

        $frames = array_map(fn (FrameRecord $record) => $this->frameFor($record), $records->all());

        return (new AgentStack($frames, $this->factory))->withoutFinishedFrames();
    }

    private function frameFor(FrameRecord $record): Frame
    {
        $type = $this->types->registry()->get($record->reference->typeKey);

        if ($record->schemaVersion !== $type->schemaVersion()) {
            throw StateSchemaUnknown::for($record->description(), $type->schemaVersion());
        }

        return Frame::restored($record, $type->stateFor($record->reference));
    }
}
