<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Events\Event;
use App\Enums\Engine\NoSubject;
use App\Exceptions\CommandAdmissionRefused;
use App\Exceptions\StateEventReentry;
use App\Models\Agents\AgentStackRow;
use App\Models\Agents\PendingAgentMessage;
use App\Support\ActorContext;
use App\Support\AgentStacks;
use App\Support\AttentionOrigin;
use App\Support\Drivers\DriverReplies;
use App\Support\Drivers\DriverReply;
use App\Support\OperationDeadline;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;
use App\Support\Stack\HookAnswer;
use App\Support\Stack\StackRestorer;
use App\Support\Stack\StateTypes;
use App\Support\StackTransaction;
use App\Support\StartStacks;
use App\Support\StateEvents\Exceptions\StateEventAfterCommitFailed;
use App\Support\StateEvents\StateEventScope;
use App\Values\ProfileBase;
use Domain\Rules\RulesDomain;
use Illuminate\Contracts\Events\Dispatcher;
use Psr\Log\LoggerInterface;
use Tests\Fixtures\Modules\Notes\Commands\RecordNoteEffect\RecordNoteEffectCommand;
use Tests\Fixtures\Modules\Notes\Events\NoteAudited;
use Tests\Fixtures\Modules\Notes\Events\NotePublished;
use Tests\Fixtures\Modules\Notes\Events\NoteWritten;
use Tests\Fixtures\Modules\Notes\Exceptions\NoteWorkFailed;
use Tests\Fixtures\Modules\Notes\Support\NoteEffects;
use Tests\Support\CommittedHookStack;
use Tests\Support\DomainBoot;
use Tests\Support\InstallsCommandModules;
use Tests\Support\RegistersNoteStates;
use Tests\Support\TestStartAuthority;
use Tests\Support\TestText;
use Tests\TestCase;

final class StateEventDeliveryTest extends TestCase
{
    /**
     * Rules, which the Notes test module requires.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class);
    }

    use CommittedHookStack {
        setUpCommittedHookStack as private setUpBaseStack;
        tearDownCommittedHookStack as private tearDownBaseStack;
    }
    use InstallsCommandModules;
    use RegistersNoteStates;

    protected function setUpCommittedHookStack(): void
    {
        $this->installCommandModules();
        $this->emptyTables('module_command_rows');
        $this->providerWithNotes()->boot();
        $this->setUpBaseStack();
    }

    protected function tearDownCommittedHookStack(): void
    {
        $this->emptyTables('module_command_rows');
        $this->tearDownBaseStack();
    }

    public function test_every_live_listener_answers_from_the_top_down(): void
    {
        $this->journal->pushState($this->target, new StateReference('notes.writing', NoSubject::None));
        $this->journal->pushState(
            $this->target,
            new StateReference('notes.watching', new SubjectReference('lower', 1)),
        );
        $this->journal->pushState($this->target, new StateReference('notes.watching', NoSubject::None));

        $this->dispatch(new NoteWritten(
            ordinary: [new RecordNoteEffectCommand('watching')],
            marked: [new RecordNoteEffectCommand('writing')],
        ));

        $this->assertSame(['watching', 'watching', 'writing'], $this->app->make(NoteEffects::class)->labels);
    }

    public function test_a_failed_collection_runs_no_effect_of_any_selected_listener(): void
    {
        $this->journal->pushState($this->target, new StateReference('notes.writing', NoSubject::None));
        $this->journal->pushState($this->target, new StateReference('notes.watching', NoSubject::None));
        $effects = $this->app->make(NoteEffects::class);

        $ordinary = [];
        $this->app->make(Dispatcher::class)->listen(NoteWritten::class, function (NoteWritten $event) use (
            &$ordinary,
        ): void {
            $ordinary[] = $event;
        });

        try {
            $this->dispatch(
                new NoteWritten(doesListenerFail: true, ordinary: [new RecordNoteEffectCommand('partial')]),
            );
            $this->fail('The failing state returned successfully.');
        } catch (NoteWorkFailed) {
            $this->assertCount(1, $ordinary);
            $this->assertSame([], $effects->labels);
        }

        $this->dispatch(
            new NoteWritten(ordinary: [new RecordNoteEffectCommand('watching')], marked: [new RecordNoteEffectCommand('writing')]),
        );
        $this->assertSame(['watching', 'writing'], $effects->labels);
    }

    public function test_a_fact_no_one_admitted_reaches_the_stack_holding_a_state_that_listens_for_it(): void
    {
        $this->journal->pushState($this->target, new StateReference('notes.writing', NoSubject::None));

        $this->app->make(Dispatcher::class)->dispatch(new NoteWritten(marked: [new RecordNoteEffectCommand('heard')]));

        $this->assertSame(['heard'], $this->app->make(NoteEffects::class)->labels);
    }

    public function test_a_listener_that_answers_with_a_state_puts_it_on_top_of_its_stack(): void
    {
        $this->journal->pushState($this->target, new StateReference('notes.writing', NoSubject::None));

        $this->app->make(Dispatcher::class)->dispatch(new NoteWritten(asksForGuide: true));

        $this->assertSame('guide', array_last($this->storedTypeKeys()));
    }

    public function test_a_fact_no_state_listens_for_reaches_no_stack(): void
    {
        $this->journal->pushState($this->target, new StateReference('notes.watching', NoSubject::None));

        $this->app->make(Dispatcher::class)->dispatch(new NoteAudited());

        $this->assertSame([], $this->app->make(NoteEffects::class)->labels);
    }

    public function test_a_closed_stack_has_no_recipient(): void
    {
        $this->journal->pushState($this->target, new StateReference('notes.writing', NoSubject::None));
        $this->app->make(StackTransaction::class)->run(
            fn () => $this->app->make(StartStacks::class)->close($this->target),
        );

        $this->dispatch(new NoteWritten(marked: [new RecordNoteEffectCommand('closed')]));

        $this->assertSame([], $this->app->make(NoteEffects::class)->labels);
    }

    public function test_a_listener_covered_by_a_new_frame_still_runs_its_remaining_effects(): void
    {
        $this->journal->pushState($this->target, new StateReference('notes.writing', NoSubject::None));
        $this->journal->pushState(
            $this->target,
            new StateReference('notes.watching', new SubjectReference('original', 1)),
        );
        $this->journal->pushState($this->target, new StateReference('guide', NoSubject::None));

        $effects = $this->app->make(NoteEffects::class);
        $effects->afterRecording(function (RecordNoteEffectCommand $command): void {
            if ($command->label === 'cover') {
                $this->app->make(AgentStacks::class)->push(
                    $this->target,
                    new StateReference('notes.watching', new SubjectReference('New cover.', 1)),
                );
            }
        });

        $this->dispatch(new NoteWritten(
            ordinary: [new RecordNoteEffectCommand('cover'), new RecordNoteEffectCommand('stale')],
            marked: [new RecordNoteEffectCommand('marked first'), new RecordNoteEffectCommand('marked second')],
        ));

        $this->assertSame(['cover', 'stale', 'marked first', 'marked second'], $effects->labels);
    }

    public function test_a_recreated_frame_does_not_receive_the_old_occurrences_remaining_effects(): void
    {
        $reference = new StateReference('notes.watching', NoSubject::None);
        $this->journal->pushState($this->target, $reference);
        $effects = $this->app->make(NoteEffects::class);
        $effects->afterRecording(function (RecordNoteEffectCommand $command) use ($reference): void {
            if ($command->label === 'replace') {
                $row = AgentStackRow::findLockedAuthorizedFor($this->target);
                $stack = $this->app->make(StackRestorer::class)->restore($row->frames, $row->target);
                $without = $stack->poppedOf($stack->top());
                $row->saveFrames($without->records(), $this->app->make(StateTypes::class)->ticking());
                $this->app->make(AgentStacks::class)->push($this->target, $reference);
            }
        });

        $this->dispatch(
            new NoteWritten(ordinary: [new RecordNoteEffectCommand('replace'), new RecordNoteEffectCommand('stale')]),
        );

        $this->assertSame(['replace'], $effects->labels);
    }

    public function test_a_live_origin_does_not_bypass_the_original_actors_command_authorization(): void
    {
        $this->journal->pushState($this->target, new StateReference('notes.watching', NoSubject::None));
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($this->target->agentId),
            TestStartAuthority::granting(ProfileBase::mainAgent(), []),
        );

        try {
            $this->dispatch(new NoteWritten(ordinary: [new RecordNoteEffectCommand('unauthorized')]));
            $this->fail('The command ran without authority.');
        } catch (CommandAdmissionRefused) {
            $this->assertSame([], $this->app->make(NoteEffects::class)->labels);
        }
    }

    public function test_a_cycle_in_an_effect_fails_visibly_and_a_later_dispatch_is_independent(): void
    {
        $this->journal->pushState($this->target, new StateReference('notes.writing', NoSubject::None));
        $effects = $this->app->make(NoteEffects::class);
        $effects->afterRecording(function (RecordNoteEffectCommand $command): void {
            if ($command->label === 'reenter') {
                $this->dispatch(new NoteWritten());
            }
        });

        // The effect's own fact waits for the effect's commit, so the cycle shows once that delivery tries to reenter.
        try {
            $this->dispatch(new NoteWritten(marked: [new RecordNoteEffectCommand('reenter')]));
            $this->fail('The delivery reentered an active origin.');
        } catch (StateEventAfterCommitFailed $failure) {
            $this->assertInstanceOf(StateEventReentry::class, $failure->getPrevious());
        }

        $this->dispatch(new NoteWritten(marked: [new RecordNoteEffectCommand('independent')]));

        $this->assertSame(['reenter', 'independent'], $effects->labels);
    }

    public function test_a_fact_dispatched_inside_an_unfinished_hook_waits_for_its_commit_and_never_reenters(): void
    {
        $this->journal->pushState($this->target, new StateReference('notes.writing', NoSubject::None));

        $reply = $this->machine()->answer(
            $this->stop(),
            $this->capabilities(),
            new OperationDeadline(),
            function (HookAnswer $answer): DriverReply {
                $this->dispatch(new NoteWritten());

                return DriverReplies::stop($answer, TestText::renderer());
            },
        );

        $this->assertInstanceOf(DriverReply::class, $reply);
    }

    public function test_after_commit_failure_reports_its_stage_and_leaves_the_producers_write(): void
    {
        $this->journal->pushState($this->target, new StateReference('notes.writing', NoSubject::None));
        $log = $this->createMock(LoggerInterface::class);
        $log->expects($this->once())->method('error')->with(
            'State event delivery failed.',
            $this->callback(fn (array $context) => $context['after_commit'] && $context['stage'] === 'collection'),
        );
        $this->app->instance(LoggerInterface::class, $log);
        $transaction = $this->app->make(StackTransaction::class);
        $event = new NotePublished(new NoteWritten(doesListenerFail: true));

        try {
            $transaction->run(function () use ($event): void {
                PendingAgentMessage::createMany(
                    $this->target->actorIdentity(),
                    AttentionOrigin::agentMessages('producer-hook'),
                    ['Saved by the producer.'],
                );
                $this->dispatch($event);
            });
            $this->fail('The after-commit failure was hidden.');
        } catch (StateEventAfterCommitFailed $failure) {
            $this->assertInstanceOf(NoteWorkFailed::class, $failure->getPrevious());
            $this->assertSame(['Saved by the producer.'], $this->takeContext());
        }
    }

    public function test_a_committed_fact_that_logs_listener_failures_keeps_the_producers_success(): void
    {
        $this->journal->pushState($this->target, new StateReference('notes.writing', NoSubject::None));
        $log = $this->createMock(LoggerInterface::class);
        $log->expects($this->once())->method('error')->with('State event delivery failed.', $this->anything());
        $this->app->instance(LoggerInterface::class, $log);

        $result = $this->app->make(StackTransaction::class)->run(function (): string {
            $this->dispatch(new NoteAudited());

            return 'committed';
        });

        $this->assertSame('committed', $result);
        $this->assertSame([], $this->takeContext());
    }

    private function dispatch(Event $event): void
    {
        $scope = $this->app->make(StateEventScope::class);
        $dispatcher = $this->app->make(Dispatcher::class);
        $scope->admit([$this->target], fn () => $dispatcher->dispatch($event));
    }

    /**
     * @return list<string>
     */
    private function takeContext(): array
    {
        $agent = $this->target->actorIdentity();
        $waiting = PendingAgentMessage::query()->ownedBy($agent)->orderBy('created_at')->orderBy('id')->get();
        PendingAgentMessage::query()->ownedBy($agent)->whereKey($waiting->modelKeys())->delete();

        return array_values($waiting->flatMap(fn (PendingAgentMessage $message) => $message->lines)->all());
    }
}
