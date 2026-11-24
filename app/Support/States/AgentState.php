<?php

declare(strict_types=1);

namespace App\Support\States;

use App\Contracts\Bus\Command;
use App\Contracts\Events\Event;
use App\Enums\FrameReuse;
use App\Support\Decisions\Contracts\AnswerPart;
use App\Support\Decisions\Decision;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\Contracts\HookAnswerer;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\PromptSubmitted;
use App\Support\Inputs\SessionEnded;
use App\Support\Inputs\SessionStarted;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\ToolRequested;
use App\Values\StackVerdict;
use PhpOption\None;
use PhpOption\Option;

/**
 * One state on an agent's stack, asked from the top down. Every hook method delegates to the state below until a state
 * overrides it, and the first deny answers the hook. A state only answers: its hook methods, its listeners and its
 * ticks never perform an external effect themselves; what they return is run by their one caller.
 */
abstract class AgentState implements HookAnswerer
{
    /**
     * How a push of this state finds a frame already on the stack instead of adding one; none by default.
     */
    public function frameReuse(): FrameReuse
    {
        return FrameReuse::None;
    }

    /**
     * Whether the work this state stands for is done. A finished frame stays stored but a walk passes over it, as if it
     * were transparent; it leaves only when an explicit pop exposes it at the top.
     */
    public function isFinished(): bool
    {
        return false;
    }

    /**
     * Whether the agent may do other work while this state is on its stack; a refusal names its reason and the tool
     * call that gets the agent out of it. Allowed by default.
     */
    public function workPermission(): StackVerdict
    {
        return StackVerdict::allow();
    }

    /**
     * The instruction the agent is shown while this is the top live state that has one; none by default.
     *
     * @return Option<string>
     */
    public function instruction(): Option
    {
        return None::create();
    }

    /**
     * The link type of the record this state's subject is, read as the agent's current work while it is the top live
     * state that names one; none by default.
     *
     * @return Option<string>
     */
    public function workRecordType(): Option
    {
        return None::create();
    }

    /**
     * The agent's session started.
     *
     * @return AnswerPart|Command<mixed>|Event|iterable<AnswerPart|Command<mixed>|Event>
     */
    public function onSessionStart(SessionStarted $input): AnswerPart|Command|Event|iterable
    {
        return Decision::delegate();
    }

    /**
     * A prompt was handed to the agent, before it starts its turn on it.
     *
     * @return AnswerPart|Command<mixed>|Event|iterable<AnswerPart|Command<mixed>|Event>
     */
    public function onPrompt(PromptSubmitted $input): AnswerPart|Command|Event|iterable
    {
        return Decision::delegate();
    }

    /**
     * The agent is about to run a shell line: deny it, rewrite it, or pass it on.
     *
     * @return AnswerPart|Command<mixed>|Event|iterable<AnswerPart|Command<mixed>|Event>
     */
    public function onShellCommand(ShellCommandRequested $input): AnswerPart|Command|Event|iterable
    {
        return Decision::delegate();
    }

    /**
     * The agent is about to create, change or remove files: deny it or pass it on.
     *
     * @return AnswerPart|Command<mixed>|Event|iterable<AnswerPart|Command<mixed>|Event>
     */
    public function onFileEdit(FileEditRequested $input): AnswerPart|Command|Event|iterable
    {
        return Decision::delegate();
    }

    /**
     * The agent is about to call a tool that is no shell line, file edit or journal tool: deny it or pass it on.
     *
     * @return AnswerPart|Command<mixed>|Event|iterable<AnswerPart|Command<mixed>|Event>
     */
    public function onToolRequested(ToolRequested $input): AnswerPart|Command|Event|iterable
    {
        return Decision::delegate();
    }

    /**
     * The agent wants to end its turn: a deny sends it back to work with the reason.
     *
     * @return AnswerPart|Command<mixed>|Event|iterable<AnswerPart|Command<mixed>|Event>
     */
    public function onStop(StopRequested $input): AnswerPart|Command|Event|iterable
    {
        return Decision::delegate();
    }

    /**
     * The agent's context was compacted, so what it was told before may be gone.
     *
     * @return AnswerPart|Command<mixed>|Event|iterable<AnswerPart|Command<mixed>|Event>
     */
    public function onCompaction(ContextCompacted $input): AnswerPart|Command|Event|iterable
    {
        return Decision::delegate();
    }

    /**
     * A tool call of the agent ended; nothing can be refused any more, only noted or answered with lines.
     *
     * @return AnswerPart|Command<mixed>|Event|iterable<AnswerPart|Command<mixed>|Event>
     */
    public function onToolFinished(ToolFinished $input): AnswerPart|Command|Event|iterable
    {
        return Decision::delegate();
    }

    /**
     * The agent's session ended.
     *
     * @return AnswerPart|Command<mixed>|Event|iterable<AnswerPart|Command<mixed>|Event>
     */
    public function onSessionEnd(SessionEnded $input): AnswerPart|Command|Event|iterable
    {
        return Decision::delegate();
    }
}
