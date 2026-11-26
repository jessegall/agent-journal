<?php

declare(strict_types=1);

namespace App\Stacks;

use App\Stacks\Contracts\StateFactory;
use App\Stacks\Declarations\StateMethods;
use App\Stacks\Exceptions\StackTooDeep;
use App\Stacks\Exceptions\StateSchemaUnknown;
use App\Stacks\Frames\Frame;
use App\Support\StateLoading\StateBuilder;
use App\Support\Storage\FrameRecords;
use App\Values\StackTarget;

/**
 * Rebuilds an agent's stack from its stored frames: the one ready bottom state and every state built from the values
 * its frame saved, finished ones included. Restoring reads no other row and removes, writes and calls nothing.
 */
final readonly class StackRestorer
{
    public function __construct(
        private StateTypes $types,
        private StateFactory $factory,
        private StateBuilder $builder,
        private StateMethodSelector $selector = new StateMethodSelector(new StateMethods()),
    ) {}

    public function restore(FrameRecords $records, StackTarget $target): AgentStack
    {
        $records->checkBottom();
        $frameRecords = $records->all();

        if (count($frameRecords) > AgentStack::DEPTH_LIMIT) {
            throw StackTooDeep::for('a stored stack', AgentStack::DEPTH_LIMIT);
        }

        $frames = [];

        foreach ($frameRecords as $record) {
            $type = $this->types->registry()->get($record->reference->typeKey);

            if ($record->schemaVersion !== $type->schemaVersion) {
                throw StateSchemaUnknown::for($record->description(), $type->schemaVersion);
            }

            $frames[] = Frame::restored($record, $this->builder->build($type, $record->values), $type->isEnabled());
        }

        return new AgentStack($frames, $this->factory, $target, $this->selector);
    }
}
