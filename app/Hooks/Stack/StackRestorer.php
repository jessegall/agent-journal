<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Hooks\Contracts\StateFactory;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Enums\ReadyStateType;
use App\Hooks\Exceptions\StateSchemaUnknown;
use App\Hooks\Storage\FrameRecord;
use App\Hooks\Storage\FrameRecords;

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

        $all = $records->all();
        $frames = [];

        foreach ($this->positionsByType($all) as $typeKey => $positions) {
            $type = $this->types->registry()->get($typeKey);

            foreach (array_chunk($positions, StateReferences::MAXIMUM) as $batch) {
                $states = $type->statesFor(new StateReferences(array_map(fn (int $position) => $all[$position]->reference, $batch)));

                foreach ($batch as $index => $position) {
                    $record = $all[$position];

                    if ($record->schemaVersion !== $type->schemaVersion()) {
                        throw StateSchemaUnknown::for($record->description(), $type->schemaVersion());
                    }

                    $frames[$position] = Frame::restored($record, $states->stateAt($index));
                }
            }
        }

        ksort($frames);

        return (new AgentStack(array_values($frames), $this->factory))->withoutFinishedFrames();
    }

    /**
     * The stack positions of the frames of each state type, so each type reads its subjects once per batch.
     *
     * @param  list<FrameRecord>  $records
     * @return array<string, list<int>>
     */
    private function positionsByType(array $records): array
    {
        $positions = [];

        foreach ($records as $position => $record) {
            $positions[$record->reference->typeKey][] = $position;
        }

        return $positions;
    }
}
