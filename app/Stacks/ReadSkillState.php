<?php

declare(strict_types=1);

namespace App\Stacks;

use App\Contracts\Events\Event;
use App\Events\Skills\SkillRead;
use App\Events\Skills\SkillReadAsked;
use App\Skills\Contracts\SkillSessionEvent;
use App\Stacks\Attributes\StateType;
use App\Stacks\Concerns\ToolBudgetDecisions;
use App\Stacks\Contracts\Work\UniqueState;
use App\Stacks\Support\ReadSkillStateReference;
use App\Support\Decisions\Decision;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Values\AgentText;
use App\Values\ProvenSkillRead;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * An agent asked to read skills whole. It keeps the skills still to read and its tool uses; once the budget is spent it
 * refuses changes until every skill is read, and it finishes when its list is empty.
 */
#[StateType(ReadSkillStateReference::class, version: 1)]
final class ReadSkillState extends AgentState implements UniqueState
{
    use ToolBudgetDecisions {
        onShellCommand as private answerShellCommand;
    }

    private const int MOST_TOOL_USES = 5;

    /**
     * The skills the agent still has to read, in the order they were asked, each once.
     *
     * @var list<string>
     */
    private array $skillKeys = [];

    private int $toolUses = 0;

    /**
     * Whether an ask reached the state; before that it is never finished, so it stays live to hear it.
     */
    private bool $hasBeenAsked = false;

    public function __construct(private readonly string $sessionId) {}

    public function isFinished(): bool
    {
        return $this->hasBeenAsked && $this->skillKeys === [];
    }

    /**
     * @return Option<AgentText>
     */
    public function instruction(): Option
    {
        if (! $this->isWaiting()) {
            return None::create();
        }

        return new Some($this->mustActNow() ? $this->actNowText() : $this->readText());
    }

    public function listensTo(Event $event): bool
    {
        return ! $event instanceof SkillSessionEvent || $event->sessionId === $this->sessionId;
    }

    // ----------[ Hooks ]----------

    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        if ($this->showsASkill($input)) {
            return Decision::delegate();
        }

        return $this->answerShellCommand($input);
    }

    public function onStop(StopRequested $input): Decision
    {
        if (! $this->isWaiting() || $input->stop->isAfterRefusedStop) {
            return Decision::delegate();
        }

        return Decision::deny($this->actNowText());
    }

    public function onToolFinished(ToolFinished $input): Decision
    {
        $this->toolUses++;

        return Decision::delegate();
    }

    // ----------[ Events ]----------

    /**
     * Skills the agent must read: those not on the list yet join it, and they start a fresh budget of tool uses.
     */
    public function onSkillReadAsked(SkillReadAsked $event): void
    {
        $this->hasBeenAsked = true;
        $added = array_values(array_diff($event->skillKeys, $this->skillKeys));

        if ($added === []) {
            return;
        }

        $this->skillKeys = [
            ...$this->skillKeys,
            ...$added,
        ];

        $this->toolUses = 0;
    }

    /**
     * The agent read a skill whole: it is no longer to read.
     */
    public function onSkillRead(SkillRead $event): void
    {
        $this->skillKeys = array_values(array_diff($this->skillKeys, [$event->skillKey]));
    }

    // ----------[ Internals ]----------

    /**
     * Whether the line is php artisan skill:show of one skill, which the shell classifier does not know as a read and
     * which the agent must still be able to run once its tool uses are spent.
     */
    private function showsASkill(ShellCommandRequested $input): bool
    {
        return preg_match(ProvenSkillRead::SKILL_SHOW, trim($input->command->source)) === 1;
    }

    private function isWaiting(): bool
    {
        return $this->skillKeys !== [];
    }

    private function mustActNow(): bool
    {
        return $this->isWaiting() && $this->toolUses >= self::MOST_TOOL_USES;
    }

    private function readText(): AgentText
    {
        return AgentText::of('core.skills.read', [
            'skills' => implode(', ', $this->skillKeys),
            'left' => max(0, self::MOST_TOOL_USES - $this->toolUses),
        ]);
    }

    private function actNowText(): AgentText
    {
        return AgentText::of('core.skills.read_now', ['skills' => implode(', ', $this->skillKeys)]);
    }
}
