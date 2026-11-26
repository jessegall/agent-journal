<?php

declare(strict_types=1);

namespace App\Support\Inputs\Contracts;

use App\Contracts\Bus\Command;
use App\Contracts\Events\Event;
use App\Support\Decisions\Contracts\AnswerPart;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\PromptSubmitted;
use App\Support\Inputs\SessionEnded;
use App\Support\Inputs\SessionStarted;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\ToolRequested;
use App\Support\References\StateReference;

/**
 * Whatever answers hooks, one method per hook; the agent states implement it. A method answers with a decision, a
 * context or message line, a command or an event to run after the hook, several of those to yield with at most one
 * decision, last. It always answers: a delegate passes the hook to the state below.
 */
interface HookHandler
{
    /**
     * The agent's session started.
     *
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>|void
     */
    public function onSessionStart(SessionStarted $input);

    /**
     * A prompt was handed to the agent, before it starts its turn on it.
     *
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>|void
     */
    public function onPrompt(PromptSubmitted $input);

    /**
     * The agent is about to run a shell line: deny it, rewrite it, or pass it on.
     *
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>|void
     */
    public function onShellCommand(ShellCommandRequested $input);

    /**
     * The agent is about to call a tool that is no shell line, file edit or journal tool: deny it or pass it on.
     *
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>|void
     */
    public function onToolRequested(ToolRequested $input);

    /**
     * The agent is about to create, change or remove files: deny it or pass it on.
     *
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>|void
     */
    public function onFileEdit(FileEditRequested $input);

    /**
     * The agent wants to end its turn: a deny sends it back to work with the reason.
     *
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>|void
     */
    public function onStop(StopRequested $input);

    /**
     * The agent's context was compacted, so what it was told before may be gone.
     *
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>|void
     */
    public function onCompaction(ContextCompacted $input);

    /**
     * A tool call of the agent ended; nothing can be refused any more, only noted or answered with lines.
     *
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>|void
     */
    public function onToolFinished(ToolFinished $input);

    /**
     * The agent's session ended.
     *
     * @return AnswerPart|Command<mixed>|Event|StateReference|iterable<AnswerPart|Command<mixed>|Event|StateReference>|void
     */
    public function onSessionEnd(SessionEnded $input);
}
