<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Support\AttentionOrigin;
use App\Bus\Exceptions\CommandAdmissionRefused;
use App\Bus\Support\OperationDeadline;
use App\Contracts\Event;
use App\Hooks\Actions\AgentStacks;
use App\Hooks\Actions\StartStacks;
use App\Hooks\Drivers\DriverReplies;
use App\Hooks\Drivers\DriverReply;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Exceptions\StateEventReentry;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Models\PendingAgentMessage;
use App\Hooks\References\StateReference;
use App\Hooks\References\SubjectReference;
use App\Hooks\Stack\HookAnswer;
use App\Hooks\Stack\StackRestorer;
use App\Hooks\Stack\StateTypes;
use App\Hooks\StateEvents\Exceptions\StateEventAfterCommitFailed;
use App\Hooks\StateEvents\StateEventScope;
use App\Hooks\Support\AgentMessageDelivery;
use App\Hooks\Support\StackTransaction;
use App\Profiles\Values\ProfileBase;
use Illuminate\Contracts\Events\Dispatcher;
use Psr\Log\LoggerInterface;
use Tests\Fixtures\Modules\Notes\Commands\RecordNoteEffect;
use Tests\Fixtures\Modules\Notes\Events\NoteAudited;
use Tests\Fixtures\Modules\Notes\Events\NotePublished;
use Tests\Fixtures\Modules\Notes\Events\NoteWritten;
use Tests\Fixtures\Modules\Notes\Exceptions\NoteWorkFailed;
use Tests\Fixtures\Modules\Notes\Support\NoteEffects;
use Tests\Support\CommittedHookStack;
use Tests\Support\InstallsCommandModules;
use Tests\Support\RegistersNoteStates;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

final class StateEventDeliveryTest extends TestCase
{
    use CommittedHookStack {
        setUpCommittedHookStack as private setUpBaseStack;
        tearDownCommittedHookStack as private tearDownBaseStack;
    }
    use InstallsCommandModules;
    use RegistersNoteStates;

    private const string EVALUATING_STACK = 'evaluating stack';

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
        $this->pushState(new StateReference('notes.writing', NoSubject::None));
        $this->pushState(new StateReference('notes.watching', new SubjectReference('lower', 1)));
        $this->pushState(new StateReference('notes.watching', NoSubject::None));

        $this->dispatch(new NoteWritten(
            ordinary: [new RecordNoteEffect('watching')],
            marked: [new RecordNoteEffect('writing')],
        ));

        $this->assertSame(['watching', 'watching', 'writing'], $this->app->make(NoteEffects::class)->labels);
    }

    public function test_a_failed_collection_runs_no_effect_of_any_selected_listener(): void
    {
        $this->pushState(new StateReference('notes.writing', NoSubject::None));
        $this->pushState(new StateReference('notes.watching', NoSubject::None));
        $effects = $this->app->make(NoteEffects::class);

        $ordinary = [];
        $this->app->make(Dispatcher::class)->listen(NoteWritten::class, function (NoteWritten $event) use (
            &$ordinary,
        ): void {
            $ordinary[] = $event;
        });

        try {
            $this->dispatch(new NoteWritten(listenerFails: true, ordinary: [new RecordNoteEffect('partial')]));
            $this->fail('The failing state returned successfully.');
        } catch (NoteWorkFailed) {
            $this->assertCount(1, $ordinary);
            $this->assertSame([], $effects->labels);
        }

        $this->dispatch(new NoteWritten(ordinary: [new RecordNoteEffect('watching')], marked: [new RecordNoteEffect('writing')]));
        $this->assertSame(['watching', 'writing'], $effects->labels);
    }

    public function test_a_closed_stack_has_no_recipient(): void
    {
        $this->pushState(new StateReference('notes.writing', NoSubject::None));
        $this->app->make(StackTransaction::class)->run(
            fn () => $this->app->make(StartStacks::class)->close($this->target),
        );

        $this->dispatch(new NoteWritten(marked: [new RecordNoteEffect('closed')]));

        $this->assertSame([], $this->app->make(NoteEffects::class)->labels);
    }

    public function test_a_listener_covered_by_a_new_frame_still_runs_its_remaining_effects(): void
    {
        $this->pushState(new StateReference('notes.writing', NoSubject::None));
        $this->pushState(new StateReference('notes.watching', new SubjectReference('original', 1)));
        $this->pushState(new StateReference('guide', NoSubject::None));

        $effects = $this->app->make(NoteEffects::class);
        $effects->afterRecording(function (RecordNoteEffect $command): void {
            if ($command->label === 'cover') {
                $this->app->make(AgentStacks::class)->push(
                    $this->target,
                    new StateReference('notes.watching', new SubjectReference('New cover.', 1)),
                );
            }
        });

        $this->dispatch(new NoteWritten(
            ordinary: [new RecordNoteEffect('cover'), new RecordNoteEffect('stale')],
            marked: [new RecordNoteEffect('marked first'), new RecordNoteEffect('marked second')],
        ));

        $this->assertSame(['cover', 'stale', 'marked first', 'marked second'], $effects->labels);
    }

    public function test_a_recreated_frame_does_not_receive_the_old_occurrences_remaining_effects(): void
    {
        $reference = new StateReference('notes.watching', NoSubject::None);
        $this->pushState($reference);
        $effects = $this->app->make(NoteEffects::class);
        $effects->afterRecording(function (RecordNoteEffect $command) use ($reference): void {
            if ($command->label === 'replace') {
                $row = AgentStackRow::lockAuthorizedFor($this->target);
                $stack = $this->app->make(StackRestorer::class)->restore($row->frames, $row->target());
                $without = $stack->poppedOf($stack->top());
                $row->saveFrames($without->records(), $this->app->make(StateTypes::class)->ticking());
                $this->app->make(AgentStacks::class)->push($this->target, $reference);
            }
        });

        $this->dispatch(new NoteWritten(ordinary: [new RecordNoteEffect('replace'), new RecordNoteEffect('stale')]));

        $this->assertSame(['replace'], $effects->labels);
    }

    public function test_a_live_origin_does_not_bypass_the_original_actors_command_authorization(): void
    {
        $this->pushState(new StateReference('notes.watching', NoSubject::None));
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($this->target->agentId),
            TestStartAuthority::granting(ProfileBase::mainAgent(), []),
        );

        try {
            $this->dispatch(new NoteWritten(ordinary: [new RecordNoteEffect('unauthorized')]));
            $this->fail('The command ran without authority.');
        } catch (CommandAdmissionRefused) {
            $this->assertSame([], $this->app->make(NoteEffects::class)->labels);
        }
    }

    public function test_a_cycle_in_an_effect_fails_visibly_and_a_later_dispatch_is_independent(): void
    {
        $this->pushState(new StateReference('notes.writing', NoSubject::None));
        $effects = $this->app->make(NoteEffects::class);
        $effects->afterRecording(function (RecordNoteEffect $command): void {
            if ($command->label === 'reenter') {
                $this->dispatch(new NoteWritten());
            }
        });

        try {
            $this->dispatch(new NoteWritten(marked: [new RecordNoteEffect('reenter')]));
            $this->fail('The delivery reentered an active origin.');
        } catch (StateEventReentry $failure) {
            $this->assertStringContainsString('cycle', $failure->getMessage());
        }

        $this->dispatch(new NoteWritten(marked: [new RecordNoteEffect('independent')]));

        $this->assertSame(['reenter', 'independent'], $effects->labels);
    }

    public function test_synchronous_delivery_cannot_reenter_the_stack_of_an_unfinished_hook(): void
    {
        $this->pushState(new StateReference('notes.writing', NoSubject::None));
        $this->expectException(StateEventReentry::class);
        $this->expectExceptionMessage(self::EVALUATING_STACK);

        $this->machine()->answer(
            $this->stop(),
            $this->capabilities(),
            new OperationDeadline(),
            function (HookAnswer $answer): DriverReply {
                $this->dispatch(new NoteWritten());

                return DriverReplies::stop($answer);
            },
        );
    }

    public function test_after_commit_failure_reports_its_stage_and_leaves_the_producers_write(): void
    {
        $this->pushState(new StateReference('notes.writing', NoSubject::None));
        $log = $this->createMock(LoggerInterface::class);
        $log->expects($this->once())->method('error')->with(
            'State event delivery failed.',
            $this->callback(fn (array $context) => $context['after_commit'] && $context['stage'] === 'collection'),
        );
        $this->app->instance(LoggerInterface::class, $log);
        $transaction = $this->app->make(StackTransaction::class);
        $event = new NotePublished(new NoteWritten(listenerFails: true));

        try {
            $transaction->run(function () use ($event): void {
                PendingAgentMessage::create(
                    $this->target->actorIdentity(),
                    AttentionOrigin::agentMessages('producer-hook'),
                    ['Saved by the producer.'],
                    requestsAttention: true,
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
        $this->pushState(new StateReference('notes.writing', NoSubject::None));
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
        return $this->app->make(StackTransaction::class)->run(
            fn () => $this->app->make(AgentMessageDelivery::class)->takeAllFor($this->target->actorIdentity()),
        );
    }
}
