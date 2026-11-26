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
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsState;
use Tests\Support\Seeding\SessionHooks;
use Tests\Support\Seeding\StateHandle;
use Tests\Support\Seeding\StateObservation;
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

    private SessionHooks $hooks;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->scoped(ShellCommandParser::class, fn () => new ListedCommandParser());
        $this->journal->owner()->agent('Writer');
        $this->session = $this->journal->sessionOf('Writer');
        $this->hooks = $this->journal->hooksFor($this->session);
    }

    public function test_pushed_empty_it_stays_live_asks_nothing_and_refuses_nothing(): void
    {
        $this->reading()
            ->given(
                $this->hooks->fileEdit('app/Thing.php'),
                fn (StateObservation $state) => $state->assertStateAnswer(AnswerType::Delegate),
            )
            ->given($this->hooks->stop(), function (StateObservation $state) {
                $state->assertStateAnswer(AnswerType::Delegate);
                $state->assertLive();
            });
    }

    public function test_an_ask_puts_its_skills_on_the_list_once_each_in_the_order_asked(): void
    {
        $this->reading()
            ->given($this->asked('alpha', 'beta'), function (StateObservation $state) {
                $state->assertValue('skillKeys', ['alpha', 'beta']);
                $state->assertValue('hasBeenAsked', true);
            })
            ->given($this->asked('beta', 'gamma'), function (StateObservation $state) {
                $state->assertValue('skillKeys', ['alpha', 'beta', 'gamma']);
            });
    }

    public function test_a_replayed_ask_changes_nothing_and_a_new_skill_starts_a_fresh_budget(): void
    {
        $this->reading()
            ->given(
                [$this->asked('alpha'), $this->hooks->toolFinished(), $this->hooks->toolFinished('pwd')],
                fn (StateObservation $state) => $state->assertValue('toolUses', 2),
            )
            ->given($this->asked('alpha'), fn (StateObservation $state) => $state->assertValue('toolUses', 2))
            ->given($this->asked('beta'), fn (StateObservation $state) => $state->assertValue('toolUses', 0));
    }

    public function test_a_read_takes_only_its_skill_off_and_an_empty_list_ends_the_state(): void
    {
        $this->reading()
            ->given([$this->asked('alpha', 'beta'), $this->read('alpha')], function (StateObservation $state) {
                $state->assertValue('skillKeys', ['beta']);
                $state->assertLive();
            })
            ->given($this->read('beta'), fn (StateObservation $state) => $state->assertFinished());
    }

    public function test_a_read_or_an_ask_of_another_session_does_not_reach_it(): void
    {
        $this->reading()->given(
            [
                new SkillReadAsked('another-session', ['alpha']),
                new SkillRead('another-session', 'alpha', ReadEvidence::SkillShow),
            ],
            fn (StateObservation $state) => $state->assertValue('skillKeys', []),
        );
    }

    public function test_once_five_tool_uses_are_spent_changes_are_refused_naming_only_the_skills_to_read(): void
    {
        $this->reading()
            ->given([$this->asked('alpha', 'beta'), $this->read('alpha')], fn (StateObservation $s) => $s->assertLive())
            ->given(
                $this->hooks->fileEdit('app/Thing.php'),
                fn (StateObservation $state) => $state->assertStateAnswer(AnswerType::Delegate),
            )
            ->given(
                [
                    $this->hooks->toolFinished(),
                    $this->hooks->toolFinished('pwd'),
                    $this->hooks->toolFinished('ls'),
                    $this->hooks->toolFinished('date'),
                    $this->hooks->toolFinished('whoami'),
                    $this->hooks->fileEdit('app/Thing.php'),
                ],
                function (StateObservation $state) {
                    $state->assertValue('toolUses', 5);
                    $state->assertStateAnswer(AnswerType::Deny);
                    $state->assertRefusedWith('beta');
                },
            )
            ->given(
                $this->hooks->shell('composer update'),
                fn (StateObservation $state) => $state->assertStateAnswer(AnswerType::Deny),
            )
            ->given(
                $this->hooks->shell('git status'),
                fn (StateObservation $state) => $state->assertStateAnswer(AnswerType::Delegate),
            )
            ->given($this->read('beta'), fn (StateObservation $state) => $state->assertFinished());
    }

    public function test_a_stop_with_skills_unread_is_refused_once_and_passes_right_after_the_refusal(): void
    {
        $this->reading()
            ->given([$this->asked('alpha'), $this->hooks->stop()], function (StateObservation $state) {
                $state->assertStateAnswer(AnswerType::Deny);
                $state->assertRefusedWith('alpha');
            })
            ->given(
                $this->hooks->stopAfterRefusal(),
                fn (StateObservation $state) => $state->assertStateAnswer(AnswerType::Delegate),
            );
    }

    private function reading(): StateHandle
    {
        return $this->journal->pushState($this->session, ReadSkillStateReference::forSession($this->session->id));
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
