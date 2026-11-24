<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Sessions\StartTransaction;
use App\Enums\ConversationModeType;
use App\Enums\DriverVariant;
use App\Enums\NoSubject;
use App\Enums\StartOriginType;
use App\Exceptions\StateTransferUnknown;
use App\Models\Agents\AgentSession;
use App\Models\Agents\AgentStackRow;
use App\Models\Starts\StartRecord;
use App\Support\ActorIdentity;
use App\Support\AgentSessions;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;
use App\Support\Stack\StateTypes;
use App\Support\StartStacks;
use App\Support\Storage\FrameRecord;
use App\Support\Storage\FrameRecords;
use App\Values\ModelSelection;
use App\Values\SelectedDriver;
use App\Values\StackTarget;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use Carbon\CarbonImmutable;
use Domain\Tasks\Models\Task;
use PhpOption\None;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A session that resumes an agent's conversation opens its stack with the durable frames of the agent's last
 * closed stack: owed work carries over, a session-only frame stays behind, a new conversation starts
 * bottom-only, and a frame nothing registers refuses the start.
 */
#[TimeLimit(seconds: 4, reason: 'It starts test agent sessions and empties the hook tables.')]
final class ContinueStackTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_resumed_session_carries_owed_work_and_leaves_session_only_frames(): void
    {
        $old = $this->closedStackWith(['tasks.working', 'skills.awaiting']);

        $continued = $this->nextSession($old, ConversationModeType::Resume);

        $this->assertSame(['hooks.ready', 'tasks.working'], $this->typeKeysOf($continued));
    }

    public function test_a_new_conversation_starts_with_the_bottom_alone(): void
    {
        $old = $this->closedStackWith(['tasks.working']);

        $fresh = $this->nextSession($old, ConversationModeType::New);

        $this->assertSame(['hooks.ready'], $this->typeKeysOf($fresh));
    }

    public function test_a_frame_nothing_registers_refuses_the_start(): void
    {
        $old = $this->closedStackWith(['gone.state']);

        $this->expectException(StateTransferUnknown::class);

        $this->nextSession($old, ConversationModeType::Resume);
    }

    /**
     * @param  list<string>  $typeKeys
     */
    private function closedStackWith(array $typeKeys): TestStart
    {
        $start = TestStart::start('writing-helper');
        $start->openStack($this->app);
        $row = AgentStackRow::query()->withoutGlobalScopes()->where('session_id', $start->session->id)->sole();
        $frames = [$row->frames->all()[0]];

        foreach ($typeKeys as $position => $typeKey) {
            $subject = $typeKey === 'skills.awaiting'
                ? NoSubject::None
                : new SubjectReference(Task::factory()->create(['title' => 'Owed work'])->id, 1);
            $frames[] = new FrameRecord(
                "frame-{$position}",
                new StateReference($typeKey, $subject),
                false,
                1,
                CarbonImmutable::now(),
            );
        }

        $row->saveFrames(new FrameRecords($frames), $this->app->make(StateTypes::class)->ticking());
        $row->closeAt(CarbonImmutable::now());

        return $start;
    }

    private function nextSession(TestStart $old, ConversationModeType $mode): AgentSession
    {
        $session = $this->app->make(AgentSessions::class)
            ->start($old->agent, TestSelections::of(), TestSelections::requestId());
        $request = new StartRequest(
            TestSelections::requestId(),
            $old->agent->id,
            SelectedDriver::resolve('claude-code', ModelSelection::named('claude-opus-5-5'), null, null, $this->app->make(DriverCatalogue::class)),
            StartOriginType::OwnerRequest,
            'helpers.job:01m7wgahp0n7766x1e1ta8ehew',
            null,
            $mode,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            variant: DriverVariant::Headless,
        );
        StartRecord::accept($request, TestSelections::pinOf($request), ActorIdentity::system(), None::create())->startedAs($session);
        $target = new StackTarget($old->agent->id, $session->id);
        $this->app->make(StartTransaction::class)->runForSession(
            $session->id,
            fn () => $this->app->make(StartStacks::class)->open($target),
        );

        return $session;
    }

    /**
     * @return list<string>
     */
    private function typeKeysOf(AgentSession $session): array
    {
        $row = AgentStackRow::query()->withoutGlobalScopes()->where('session_id', $session->id)->sole();

        return array_map(fn (FrameRecord $record) => $record->reference->typeKey, $row->frames->all());
    }
}
