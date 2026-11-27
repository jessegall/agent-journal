<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Bus\Contracts\Command;
use App\Contracts\Events\Event;
use App\Stacks\AgentState;
use App\Stacks\Decisions\Contracts\AnswerPart;
use App\Support\Inputs\ShellCommandRequested;
use Closure;
use Generator;

/**
 * A test state that answers each shell line with what its closure gives for it.
 */
final class ShellAnswerState extends AgentState
{
    /**
     * @param  Closure(ShellCommandRequested): (AnswerPart|Command<mixed>|Event|Generator<int, AnswerPart|Command<mixed>|Event>)  $answer
     */
    public function __construct(private readonly Closure $answer) {}

    /**
     * @return AnswerPart|Command<mixed>|Event|Generator<int, AnswerPart|Command<mixed>|Event>
     */
    public function onShellCommand(ShellCommandRequested $input): AnswerPart|Command|Event|Generator
    {
        return ($this->answer)($input);
    }
}
