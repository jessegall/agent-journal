<?php

declare(strict_types=1);

namespace Tests\Machinery\Hooks;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Enums\ConversationModeType;
use App\Models\Agents\AgentSession;
use App\Models\Agents\AgentStackRow;
use App\Models\Sessions\SessionRequest;
use App\Sessions\AgentSessions;
use App\Sessions\Contracts\StartTransaction;
use App\Sessions\Enums\StartOriginType;
use App\Sessions\Values\StartPolicy;
use App\Stacks\Exceptions\StateTransferUnknown;
use App\Stacks\References\StateReference;
use App\Stacks\References\SubjectReference;
use App\Stacks\SessionStateLifecycle;
use App\Stacks\StateTypes;
use App\Support\ActorReference;
use App\Support\RecordIdentity;
use App\Support\Storage\FrameRecord;
use App\Support\Storage\FrameRecords;
use App\Values\ModelSelection;
use App\Values\SelectedDriver;
use App\Values\StackTarget;
use App\Values\StartRequest;
use Carbon\CarbonImmutable;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use PhpOption\None;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A session that resumes an agent's conversation opens its stack with the durable frames of the agent's last
 * closed stack: owed work carries over, a new conversation starts bottom-only, and a frame nothing registers
 * refuses the start.
 */
#[TimeLimit(seconds: 4, reason: 'It starts test agent sessions and empties the hook tables.')]
#[TestsMachinery(AgentSessions::class)]
final class ContinueStackTest extends TestCase
{
    use RefreshHookDatabase;

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_a_resumed_session_carries_owed_work(): void
    {
        $old = $this->closedStackWith(['tasks.work']);

        $continued = $this->nextSession($old, ConversationModeType::Resume);

        $this->assertSame(['core.ready', 'core.profile', 'tasks.work'], $this->typeKeysOf($continued));
    }

    public function test_a_new_conversation_starts_with_the_bottom_alone(): void
    {
        $old = $this->closedStackWith(['tasks.work']);

        $fresh = $this->nextSession($old, ConversationModeType::New);

        $this->assertSame(['core.ready', 'core.profile'], $this->typeKeysOf($fresh));
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
        $start = $this->journal->signedStart('Writer', 'writing-helper');
        $start->openStack($this->app);
        $row = AgentStackRow::query()->withoutGlobalScopes()->where('session_id', $start->session->id)->sole();
        $frames = [$row->frames->all()[0]];

        foreach ($typeKeys as $position => $typeKey) {
            $subject = new SubjectReference(Task::factory()->create(['title' => 'Owed work'])->id, 1);
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
            SelectedDriver::resolve(
                'claude-code',
                ModelSelection::named('claude-opus-5-5'),
                null,
                null,
                null,
                $this->app->make(DriverCatalogue::class)
            ),
            StartOriginType::OwnerRequest,
            new RecordIdentity('helpers.helper-job', '01m7wgahp0n7766x1e1ta8ehew'),
            null,
            $mode,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            driverType: DriverType::Headless,
        );
        SessionRequest::create(
            $request,
            TestSelections::pinOf($request),
            ActorReference::system(),
            None::create(),
        )->startedAs($session);
        $target = new StackTarget($old->agent->id, $session->id);
        $this->app->make(StartTransaction::class)->runForSession(
            $session->id,
            fn () => $this->app->make(SessionStateLifecycle::class)->open($target),
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
