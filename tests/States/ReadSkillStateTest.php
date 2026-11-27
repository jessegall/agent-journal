<?php

declare(strict_types=1);

namespace Tests\States;

use App\Events\Skills\SkillRead;
use App\Events\Skills\SkillReadAsked;
use App\Hooks\Enums\AnswerType;
use App\Models\Agents\AgentSession;
use App\Processes\Contracts\ShellCommandParser;
use App\Skills\Enums\ReadEvidence;
use App\Stacks\ReadSkillState;
use App\Stacks\Support\ReadSkillStateReference;
use Tests\Fixtures\Hooks\ListedCommandParser;
use Tests\Support\Assertions\StateAssert;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsState;
use Tests\Support\Seeding\SessionHook;
use Tests\Support\Seeding\StateHandle;
use Tests\TestCase;

/**
 * The read skill state on the real engine: pushed empty it asks nothing; an ask puts skills on its list, a read takes
 * one off, and it ends when the list is empty; five finished tool uses later it refuses changes naming only the skills
 * still to read, but never a read, and its first refused stop passes the next one.
 */
#[TestsState(ReadSkillState::class)]
final class ReadSkillStateTest extends TestCase
{
    use CommitsHookRows;

    /**
     * Facts reach a stack once its change commits, so these tests commit and empty what they wrote.
     */
    private const array TABLES = ['agent_stacks', 'command_receipts'];

    private AgentSession $session;

    private ReadSkillStateReference $reading;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->scoped(ShellCommandParser::class, fn () => new ListedCommandParser());
        $this->journal->owner()->agent('Writer');
        $this->session = $this->journal->sessionOf('Writer');
        $this->reading = ReadSkillStateReference::forSession($this->session->id);
        $this->journal->pushState('Writer', $this->reading);
    }

    public function test_pushed_empty_it_stays_live_asks_nothing_and_refuses_nothing(): void
    {
        $this->journal->stateOn('Writer', $this->reading, fn (StateHandle $reading) => $reading
            ->fileEdit(
                'app/Thing.php',
                fn (StateAssert $state) => $state->answers(AnswerType::Delegate),
            )
            ->stop(fn (StateAssert $state) => $state
                ->answers(AnswerType::Delegate)
                ->isLive()));
    }

    public function test_an_ask_puts_its_skills_on_the_list_once_each_in_the_order_asked(): void
    {
        $this->journal->stateOn('Writer', $this->reading, fn (StateHandle $reading) => $reading
            ->steps([$this->asked('alpha', 'beta')], fn (StateAssert $state) => $state
                ->where('skillKeys', ['alpha', 'beta'])
                ->where('hasBeenAsked', true))
            ->steps([$this->asked('beta', 'gamma')], fn (StateAssert $state) => $state->where('skillKeys', ['alpha', 'beta', 'gamma'])));
    }

    public function test_a_replayed_ask_changes_nothing_and_a_new_skill_starts_a_fresh_budget(): void
    {
        $this->journal->stateOn('Writer', $this->reading, fn (StateHandle $reading) => $reading
            ->steps(
                [$this->asked('alpha'), SessionHook::toolFinished(), SessionHook::toolFinished('pwd')],
                fn (StateAssert $state) => $state->where('toolUses', 2),
            )
            ->steps([$this->asked('alpha')], fn (StateAssert $state) => $state->where('toolUses', 2))
            ->steps([$this->asked('beta')], fn (StateAssert $state) => $state->where('toolUses', 0)));
    }

    public function test_a_read_takes_only_its_skill_off_and_an_empty_list_ends_the_state(): void
    {
        $this->journal->stateOn('Writer', $this->reading, fn (StateHandle $reading) => $reading
            ->steps([$this->asked('alpha', 'beta'), $this->read('alpha')], fn (StateAssert $state) => $state
                ->where('skillKeys', ['beta'])
                ->isLive())
            ->steps([$this->read('beta')], fn (StateAssert $state) => $state->isFinished()));
    }

    public function test_a_read_or_an_ask_of_another_session_does_not_reach_it(): void
    {
        $this->journal->stateOn('Writer', $this->reading, fn (StateHandle $reading) => $reading->steps(
            [
                new SkillReadAsked('another-session', ['alpha']),
                new SkillRead('another-session', 'alpha', ReadEvidence::SkillShow),
            ],
            fn (StateAssert $state) => $state->where('skillKeys', []),
        ));
    }

    public function test_once_five_tool_uses_are_spent_changes_are_refused_naming_only_the_skills_to_read(): void
    {
        $this->journal->stateOn('Writer', $this->reading, fn (StateHandle $reading) => $reading
            ->steps([$this->asked('alpha', 'beta'), $this->read('alpha')], fn (StateAssert $s) => $s->isLive())
            ->fileEdit(
                'app/Thing.php',
                fn (StateAssert $state) => $state->answers(AnswerType::Delegate),
            )
            ->steps(
                [
                    SessionHook::toolFinished(),
                    SessionHook::toolFinished('pwd'),
                    SessionHook::toolFinished('ls'),
                    SessionHook::toolFinished('date'),
                    SessionHook::toolFinished('whoami'),
                    SessionHook::fileEdit('app/Thing.php'),
                ],
                fn (StateAssert $state) => $state
                    ->where('toolUses', 5)
                    ->answers(AnswerType::Deny)
                    ->refuses('beta'),
            )
            ->shell(
                'composer update',
                fn (StateAssert $state) => $state->answers(AnswerType::Deny),
            )
            ->shell(
                'git status',
                fn (StateAssert $state) => $state->answers(AnswerType::Delegate),
            )
            ->shell(
                'php artisan skill:show beta',
                fn (StateAssert $state) => $state->answers(AnswerType::Delegate),
            )
            ->shell(
                'php artisan skill:show beta; rm -rf x',
                fn (StateAssert $state) => $state->answers(AnswerType::Deny),
            )
            ->steps([$this->read('beta')], fn (StateAssert $state) => $state->isFinished()));
    }

    public function test_a_stop_with_skills_unread_is_refused_once_and_passes_right_after_the_refusal(): void
    {
        $this->journal->stateOn('Writer', $this->reading, fn (StateHandle $reading) => $reading
            ->steps([$this->asked('alpha'), SessionHook::stop()], fn (StateAssert $state) => $state
                ->answers(AnswerType::Deny)
                ->refuses('alpha'))
            ->stopAfterRefusal(
                fn (StateAssert $state) => $state->answers(AnswerType::Delegate),
            ));
    }

    private function asked(string ...$keys): SkillReadAsked
    {
        return new SkillReadAsked($this->session->id, array_values($keys));
    }

    private function read(string $key): SkillRead
    {
        return new SkillRead($this->session->id, $key, ReadEvidence::SkillShow);
    }
}
