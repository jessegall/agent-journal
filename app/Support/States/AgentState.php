<?php

declare(strict_types=1);

namespace App\Support\States;

use App\Contracts\Bus\Command;
use App\Contracts\Events\Event;
use App\Enums\Engine\FrameReuse;
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
use App\Support\References\StateReference;
use App\Values\AgentText;
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
     * The instruction the agent is shown while this is the top live state that has one; none by default.
     *
     * @return Option<AgentText>
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
     * Whether the state hears the event, asked before its listener for it is called; a state that follows one subject
     * answers no for the events of any other, so its listeners need no check of their own.
     */
    public function hears(Event $event): bool
    {
        return true;
    }

    // ----------[ Lifecycle ]----------

    /**
     * The commands and events to answer once the state's frame first went live on its stack; none by default.
     *
     * @return Command<mixed>|Event|iterable<Command<mixed>|Event>|void
     */
    public function onEnter() {}

    /**
     * The commands and events to answer once the state's frame is the top live frame again after the frames above
     * it went; none by default.
     *
     * @return Command<mixed>|Event|iterable<Command<mixed>|Event>|void
     */
    public function onResume() {}

    /**
     * The commands and events to answer once the state's frame stopped being live: its work finished, it was popped or
     * its type was switched off; none by default.
     *
     * @return Command<mixed>|Event|iterable<Command<mixed>|Event>|void
     */
    public function onExit() {}

    // ----------[ Hooks ]----------

    /**
     * The agent's session started.
     *
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>|void
     */
    public function onSessionStart(SessionStarted $input)
    {
        return Decision::delegate();
    }

    /**
     * A prompt was handed to the agent, before it starts its turn on it.
     *
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>|void
     */
    public function onPrompt(PromptSubmitted $input)
    {
        return Decision::delegate();
    }

    /**
     * The agent is about to run a shell line: deny it, rewrite it, or pass it on.
     *
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>|void
     */
    public function onShellCommand(ShellCommandRequested $input)
    {
        return Decision::delegate();
    }

    /**
     * The agent is about to create, change or remove files: deny it or pass it on.
     *
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>|void
     */
    public function onFileEdit(FileEditRequested $input)
    {
        return Decision::delegate();
    }

    /**
     * The agent is about to call a tool that is no shell line, file edit or journal tool: deny it or pass it on.
     *
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>|void
     */
    public function onToolRequested(ToolRequested $input)
    {
        return Decision::delegate();
    }

    /**
     * The agent wants to end its turn: a deny sends it back to work with the reason.
     *
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>|void
     */
    public function onStop(StopRequested $input)
    {
        return Decision::delegate();
    }

    /**
     * The agent's context was compacted, so what it was told before may be gone.
     *
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>|void
     */
    public function onCompaction(ContextCompacted $input)
    {
        return Decision::delegate();
    }

    /**
     * A tool call of the agent ended; nothing can be refused any more, only noted or answered with lines.
     *
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>|void
     */
    public function onToolFinished(ToolFinished $input)
    {
        return Decision::delegate();
    }

    /**
     * The agent's session ended.
     *
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>|void
     */
    public function onSessionEnd(SessionEnded $input)
    {
        return Decision::delegate();
    }
}
