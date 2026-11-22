<?php

declare(strict_types=1);

namespace App\Support\Stack;

use App\Contracts\ConditionalStateType;
use App\Declarations\StateMethods;
use App\Exceptions\StackTooDeep;
use App\Exceptions\StateSchemaUnknown;
use App\Support\Decisions\StateReferences;
use App\Support\Stack\Contracts\StateFactory;
use App\Support\Stack\Frames\Frame;
use App\Support\Storage\FrameRecord;
use App\Support\Storage\FrameRecords;
use App\Values\StackTarget;

/**
 * Rebuilds an agent's stack from its stored frames: the one ready bottom state and every state read fresh,
 * finished ones included. Restoring only reads: it removes, writes and calls nothing.
 */
final readonly class StackRestorer
{
    public function __construct(
        private StateTypes $types,
        private StateFactory $factory,
        private StateMethodSelector $selector = new StateMethodSelector(new StateMethods()),
        private TargetStates $states = new TargetStates(),
    ) {}

    public function restore(FrameRecords $records, StackTarget $target): AgentStack
    {
        $records->checkBottom();
        $frameRecords = $records->all();

        if (count($frameRecords) > AgentStack::DEPTH_LIMIT) {
            throw StackTooDeep::for('a stored stack', AgentStack::DEPTH_LIMIT);
        }

        $frames = [];

        foreach ($this->positionsByType($frameRecords) as $typeKey => $positions) {
            $type = $this->types->registry()->get($typeKey);

            $stateClass = $type->stateClass();

            foreach (array_chunk($positions, StateReferences::MAXIMUM) as $batch) {
                $typeEnabled = ! $type instanceof ConditionalStateType || $type->isEnabled();

                $states = $this->states->of(
                    $type,
                    new StateReferences(array_map(fn (int $position) => $frameRecords[$position]->reference, $batch)),
                    $target,
                );

                foreach ($batch as $index => $position) {
                    $record = $frameRecords[$position];

                    if ($record->schemaVersion !== $type->schemaVersion()) {
                        throw StateSchemaUnknown::for($record->description(), $type->schemaVersion());
                    }

                    $state = $states->stateOfClassAt($index, $stateClass);
                    $frames[$position] = Frame::restored($record, $state, $typeEnabled);
                }
            }
        }

        ksort($frames);

        return new AgentStack(array_values($frames), $this->factory, $target, $this->selector);
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
