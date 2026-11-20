<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Hooks\Contracts\ConditionalStateType;
use App\Hooks\Contracts\StateFactory;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Declarations\StateMethods;
use App\Hooks\Exceptions\StackTooDeep;
use App\Hooks\Exceptions\StateSchemaUnknown;
use App\Hooks\Storage\FrameRecord;
use App\Hooks\Storage\FrameRecords;

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
    ) {}

    public function restore(FrameRecords $records): AgentStack
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
                $states = $type->statesFor(
                    new StateReferences(array_map(fn (int $position) => $frameRecords[$position]->reference, $batch)),
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

        return new AgentStack(array_values($frames), $this->factory, $this->selector);
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
