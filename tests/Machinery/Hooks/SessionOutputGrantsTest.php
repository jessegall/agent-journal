<?php

declare(strict_types=1);

namespace Tests\Machinery\Hooks;

use App\Access\AccessSettings;
use App\Agents\Commands\StartAgent\StartAgentCommand;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Enums\ConversationModeType;
use App\Bus\Contracts\CommandBus;
use App\Hooks\ConversationVisits;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionOutputGrant;
use App\Models\Sessions\SessionProcess;
use App\Reads\Contracts\SessionOutputAccess;
use App\Sessions\Enums\StartOriginType;
use App\Sessions\StartSessions;
use App\Sessions\Values\StartPolicy;
use App\Support\RecordIdentity;
use App\Values\StartRequest;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A session start maps the session's saved outputs for its running start: the session reads its own transcripts and
 * large outputs across clears and resumes, never a sibling's or a fork parent's, and nothing once its start ended.
 */
#[TestsMachinery(SessionOutputAccess::class)]
final class SessionOutputGrantsTest extends TestCase
{
    use RefreshHookDatabase;
    use WithActiveAccount;

    /**
     * @var array<string, string>
     */
    private array $owners = [];

    private const string PROJECT = '/journal/accounts/claude-code/projects/-work';

    private Agent $agent;

    private ConversationVisits $visits;

    private SessionOutputAccess $access;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
        $owner = $this->journal->owner()->ownerUser();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->journal->actAsUserId($owner->id);
        $this->agent = $this->journal->idleAgent('Researcher', 'read-only-helper')->agentCalled('Researcher');
        $this->visits = $this->app->make(ConversationVisits::class);
        $this->access = $this->app->make(SessionOutputAccess::class);
    }

    public function test_own_outputs_stay_readable_across_clear_and_resume(): void
    {
        $session = $this->start('helpers.helper-job 1');

        $this->enter($session, 'native-a', 'call-1');
        $this->enter($session, 'native-b', 'call-2');
        $this->enter($session, 'native-a', 'call-3');

        $this->assertTrue($this->access->mayRead($session->id, self::PROJECT.'/native-a.jsonl'));
        $this->assertTrue($this->access->mayRead($session->id, self::PROJECT.'/native-a/tool-results/out.txt'));
        $this->assertTrue($this->access->mayRead($session->id, self::PROJECT.'/native-b/tool-results/out.txt'));
        $this->assertCount(2, $this->access->grantedTo($session->id));
        $start = SessionProcess::findCurrentOf($session->id);
        $this->assertSame(3, $start?->output_generation);
        $this->assertSame(0, SessionOutputGrant::query()->where('mapping_generation', '<', 3)->count());
    }

    public function test_sibling_fork_parent_and_unverified_paths_stay_denied(): void
    {
        $sibling = $this->start(
            'helpers.helper-job 1',
            $this->journal->idleAgent('Reviewer', 'read-only-helper')->agentCalled('Reviewer'),
        );
        $session = $this->start('helpers.helper-job 2');
        $this->enter($sibling, 'native-parent', 'call-1');

        $this->enter($session, 'native-fork', 'call-2');
        $this->visits->entered($session->id, 'native-x', '/elsewhere/native-x.jsonl', 'call-3', CarbonImmutable::now());
        $this->visits->entered(
            $session->id,
            'native-y',
            self::PROJECT.'/native-z.jsonl',
            'call-4',
            CarbonImmutable::now(),
        );

        $this->assertTrue($this->access->mayRead($session->id, self::PROJECT.'/native-fork/tool-results/out.txt'));
        $this->assertFalse($this->access->mayRead($session->id, self::PROJECT.'/native-parent.jsonl'));
        $this->assertFalse($this->access->mayRead($session->id, self::PROJECT.'/native-parent/tool-results/out.txt'));
        $this->assertFalse($this->access->mayRead($session->id, self::PROJECT.'/native-fork/../native-parent.jsonl'));
        $this->assertFalse($this->access->mayRead($session->id, self::PROJECT));
        $this->assertCount(1, $this->access->grantedTo($session->id));
    }

    public function test_an_ended_start_grants_nothing(): void
    {
        $session = $this->start('helpers.helper-job 1');
        $this->enter($session, 'native-a', 'call-1');

        SessionProcess::findCurrentOf($session->id)?->stopWithProof();

        $this->assertSame([], $this->access->grantedTo($session->id));
    }

    public function test_a_continuation_of_the_same_agent_carries_the_old_sessions_grants(): void
    {
        $predecessor = $this->start('helpers.helper-job 1');
        $this->enter($predecessor, 'native-a', 'call-1');
        $other = $this->journal->idleAgent('Reviewer', 'read-only-helper')->agentCalled('Reviewer');
        $this->app->make(StartSessions::class)->end($predecessor);

        $successor = $this->start($predecessor->id);
        $stranger = $this->start($predecessor->id, $other);
        $this->enter($successor, 'native-b', 'call-2');
        $this->enter($stranger, 'native-c', 'call-3');

        $this->assertTrue($this->access->mayRead($successor->id, self::PROJECT.'/native-a/tool-results/out.txt'));
        $this->assertFalse($this->access->mayRead($stranger->id, self::PROJECT.'/native-a/tool-results/out.txt'));
    }

    private function enter(AgentSession $session, string $nativeId, string $eventId): void
    {
        $this->visits->entered(
            $session->id,
            $nativeId,
            self::PROJECT."/{$nativeId}.jsonl",
            $eventId,
            CarbonImmutable::now(),
        );
    }

    private function start(string $context, Agent|null $agent = null): AgentSession
    {
        $request = new StartRequest(
            TestSelections::requestId(),
            ($agent ?? $this->agent)->id,
            TestSelections::of(),
            StartOriginType::OwnerRequest,
            $this->ownerOf($context),
            $context,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            driverType: DriverType::Headless,
        );

        return AgentSession::query()->findOrFail(
            $this->app->make(CommandBus::class)->run(new StartAgentCommand($request))->sessionId,
        );
    }

    /**
     * The job each conversation context was started for, the same one each time the context is started.
     */
    private function ownerOf(string $context): RecordIdentity
    {
        return $this->owners[$context] ??= new RecordIdentity('tests.owner', (string) Str::ulid());
    }
}
