<?php

declare(strict_types=1);

namespace App\Hooks\Settlement;

use App\Agents\Values\StackTarget;
use App\Hooks\Enums\LifecycleStage;
use App\Hooks\Lifecycle\LifecycleAnswer;
use App\Hooks\Lifecycle\LifecycleOrigin;
use App\Hooks\Stack\Frames\Frame;
use App\Hooks\Values\LifecycleCommands;
use Illuminate\Support\Str;

/**
 * The answers of one settled stack change, in the order the callbacks ran, each with its ordinal under one transition.
 */
final class LifecycleAnswers
{
    private readonly string $transitionId;

    /**
     * @var list<LifecycleAnswer>
     */
    private array $answers = [];

    public function __construct(private readonly StackTarget $target)
    {
        $this->transitionId = (string) Str::ulid();
    }

    public function add(Frame $frame, LifecycleStage $stage, LifecycleCommands $commands): void
    {
        $origin = new LifecycleOrigin(
            $this->target,
            $this->transitionId,
            count($this->answers) + 1,
            $frame->id,
            $frame->reference,
            $stage,
        );

        $this->answers[] = new LifecycleAnswer($origin, $commands);
    }

    /**
     * @return list<LifecycleAnswer>
     */
    public function withCommands(): array
    {
        return array_values(
            array_filter($this->answers, fn (LifecycleAnswer $answer) => ! $answer->commands->isEmpty()),
        );
    }
}
