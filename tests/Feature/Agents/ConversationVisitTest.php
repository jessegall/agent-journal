<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Actions\RecordConversationVisit;
use App\Agents\Actions\StartSessions;
use App\Agents\Commands\StartAgent;
use App\Agents\Contracts\ProgramConversationResolver;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\StartOriginType;
use App\Agents\Exceptions\ConversationIncompatible;
use App\Agents\Models\AgentSession;
use App\Agents\Models\ConversationVisit;
use App\Agents\Values\StartPolicy;
use App\Agents\Values\StartRequest;
use App\Bus\Contracts\CommandBus;
use App\Programs\Enums\HookProgram;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\HasResearcherAgent;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsOwnerRequest;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * Every session start records the native conversation the journal session entered, in order and once per event,
 * and a conversation bound to another context is refused.
 */
final class ConversationVisitTest extends TestCase
{
    use HasResearcherAgent;
    use RefreshHookDatabase;
    use StartsOwnerRequest;
    use WithActiveAccount;

    /**
     * @var array<string, string>
     */
    private array $owners = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
    }

    public function test_a_b_a_in_one_process_gives_three_ordered_visits_on_one_session(): void
    {
        $session = $this->start('helpers.job 1');
        $visits = $this->app->make(RecordConversationVisit::class);

        $visits->entered($session->id, 'native-a', null, 'call-1', CarbonImmutable::now());
        $visits->entered($session->id, 'native-b', null, 'call-2', CarbonImmutable::now());
        $visits->entered($session->id, 'native-a', null, 'call-3', CarbonImmutable::now());

        $kept = ConversationVisit::query()->where('session_id', $session->id)->orderBy('sequence_number')->get();
        $this->assertSame([1, 2, 3], $kept->pluck('sequence_number')->all());
        $this->assertSame($kept[0]->conversation_id, $kept[2]->conversation_id);
        $this->assertNotSame($kept[0]->conversation_id, $kept[1]->conversation_id);
        $this->assertSame('native-a', $session->fresh(['currentConversation'])?->currentConversation?->native_id);
    }

    public function test_a_retry_with_the_same_event_id_adds_no_visit(): void
    {
        $session = $this->start('helpers.job 1');
        $visits = $this->app->make(RecordConversationVisit::class);

        $visits->entered($session->id, 'native-a', null, 'call-1', CarbonImmutable::now());
        $visits->entered($session->id, 'native-a', null, 'call-1', CarbonImmutable::now());

        $this->assertSame(1, ConversationVisit::query()->where('session_id', $session->id)->count());
    }

    public function test_a_resume_into_a_conversation_of_another_context_is_refused_and_adds_no_visit(): void
    {
        $first = $this->start('helpers.job 1');
        $visits = $this->app->make(RecordConversationVisit::class);
        $visits->entered($first->id, 'native-a', null, 'call-1', CarbonImmutable::now());
        $this->app->make(StartSessions::class)->end($first);
        $second = $this->start('helpers.job 2');

        $this->assertThrows(
            fn () => $visits->entered($second->id, 'native-a', null, 'call-2', CarbonImmutable::now()),
            ConversationIncompatible::class,
        );

        $this->assertSame(0, ConversationVisit::query()->where('session_id', $second->id)->count());
        $this->assertNull($second->fresh()?->current_conversation_id);
    }

    public function test_the_reader_gives_an_agents_conversations_with_their_last_model(): void
    {
        $session = $this->start('helpers.job 1');
        $this->app->make(RecordConversationVisit::class)->entered(
            $session->id,
            'native-a',
            null,
            'call-1',
            CarbonImmutable::now(),
        );

        $conversations = $this->app->make(ProgramConversationResolver::class)->conversations(
            $this->agent->id,
            HookProgram::ClaudeCode,
            'helpers.job 1',
        );

        $this->assertSame(
            [['native-a', TestSelections::MODEL]],
            array_map(fn ($conversation) => [$conversation->nativeId, $conversation->lastModel], $conversations),
        );
        $this->assertSame(
            [],
            $this->app->make(ProgramConversationResolver::class)->conversations(
                $this->agent->id,
                HookProgram::ClaudeCode,
                'helpers.job 2',
            ),
        );
    }

    private function start(string $context): AgentSession
    {
        $request = new StartRequest(
            TestSelections::requestId(),
            $this->agent->id,
            TestSelections::of(),
            StartOriginType::OwnerRequest,
            $this->ownerOf($context),
            $context,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
        );

        return AgentSession::query()->findOrFail(
            $this->app->make(CommandBus::class)->run(new StartAgent($request))->sessionId,
        );
    }

    /**
     * The job each conversation context was started for, the same one each time the context is started.
     */
    private function ownerOf(string $context): string
    {
        return $this->owners[$context] ??= 'helpers.job:'.Str::ulid();
    }
}
