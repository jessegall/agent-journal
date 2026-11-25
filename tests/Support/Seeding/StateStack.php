<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Models\Agents\AgentStackRow;
use App\Support\References\StateReference;
use App\Support\Stack\AgentStack;
use App\Support\Stack\Frames\Frame;
use App\Support\Stack\StackRestorer;
use App\Values\StackTarget;
use Illuminate\Contracts\Foundation\Application;

/**
 * The stored stack of one target as the engine restores it, read fresh on each call.
 */
final readonly class StateStack
{
    public function __construct(private Application $app, public StackTarget $target) {}

    public function stack(): AgentStack
    {
        $row = AgentStackRow::query()->withoutGlobalScopes()->forTarget($this->target)->sole();

        return $this->app->make(StackRestorer::class)->restore($row->frames, $row->target);
    }

    /**
     * The one frame of the reference on the stack, live or finished.
     */
    public function onlyFrameOf(StateReference $reference): Frame
    {
        $frames = array_values(
            array_filter($this->stack()->frames(), fn (Frame $frame) => $frame->isFor($reference)),
        );

        if (count($frames) !== 1) {
            throw FixtureRefused::notOneFrame($reference->typeKey, count($frames));
        }

        return $frames[0];
    }
}
