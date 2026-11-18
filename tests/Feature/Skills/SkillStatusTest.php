<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Agents\Enums\AgentRole;
use App\Agents\Enums\SessionStatus;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Skills\Contracts\SkillPublisher;
use App\Skills\Enums\PublicationState;
use App\Skills\Exceptions\SkillSessionHidden;
use App\Skills\Models\SkillGeneration;
use App\Skills\Models\SkillPublication;
use App\Skills\Readers\Support\SkillStatusReader;
use App\Skills\Support\HostSkillPublisher;
use App\Skills\Support\SkillPublishing;
use App\Skills\Support\SkillTargets;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Skills\FullDiskPublisher;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * skill:status shows the newest generation and each session's newest publication; a failed one carries its reason and
 * the retry command and is never shown delivered, and an agent sees only its own sessions.
 */
final class SkillStatusTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'skill_publications',
        'skill_generations',
        'command_receipts',
        'agent_sessions',
        'agents',
    ];

    private string $root;

    protected function setUp(): void
    {
        parent::setUp();

        $this->root = sys_get_temp_dir().'/journal-skills-'.bin2hex(random_bytes(6));
        File::makeDirectory($this->root, recursive: true);
        $this->root = (string) realpath($this->root);
        $this->app->instance(SkillTargets::class, new SkillTargets($this->root));
        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(7)));
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->root);

        parent::tearDown();
    }

    public function test_before_a_refresh_it_says_there_is_no_generation(): void
    {
        $this->artisan('skill:status')
            ->expectsOutputToContain('No generation yet: run php artisan skill:refresh.')
            ->expectsOutputToContain('No session has a publication.')
            ->assertSuccessful();
    }

    public function test_it_shows_the_ready_generation_and_a_failed_publication_with_its_reason_and_retry(): void
    {
        $delivered = $this->publish($this->launchSession('Main', AgentRole::MainAgent), 'First text.');
        $this->app->instance(SkillPublisher::class, new FullDiskPublisher($this->app->make(HostSkillPublisher::class)));
        $failed = $this->publish($this->launchSession('Helper', AgentRole::WritingHelper), 'Second text.');

        Artisan::call('skill:status', ['--json' => true]);
        $status = json_decode(Artisan::output(), true, flags: JSON_THROW_ON_ERROR);
        $bySession = array_column($status['publications'], null, 'session');

        $this->assertSame('ready', $status['generation']['state']);
        $this->assertSame('delivered', $bySession[$delivered->session_id]['state']);
        $this->assertNull($bySession[$delivered->session_id]['retry']);
        $this->assertSame('failed', $bySession[$failed->session_id]['state']);
        $this->assertStringContainsString('no space left', (string) $bySession[$failed->session_id]['error']);
        $this->assertSame("php artisan skill:retry {$failed->id}", $bySession[$failed->session_id]['retry']);

        $this->artisan('skill:status', ['--session' => $failed->session_id])
            ->expectsOutputToContain('failed')
            ->expectsOutputToContain("php artisan skill:retry {$failed->id}")
            ->assertSuccessful();
    }

    public function test_an_agent_sees_only_its_own_sessions(): void
    {
        $own = $this->publish($this->launchSession('Main', AgentRole::MainAgent), 'First text.');
        $other = $this->publish($this->launchSession('Helper', AgentRole::WritingHelper), 'Second text.');
        $agentId = AgentSession::byId($own->session_id)->agent_id;
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent($agentId));

        $status = $this->app->make(SkillStatusReader::class)->status();

        $this->assertCount(1, $status->publications);
        $this->assertSame($own->id, $status->publications[0]->publicationId);

        try {
            $this->app->make(SkillStatusReader::class)->statusOfSession($other->session_id);
            $this->fail('Another session\'s status was shown to the agent.');
        } catch (SkillSessionHidden $hidden) {
            $this->assertSame('No skill delivery was found for that session.', $hidden->getMessage());
            $this->assertStringNotContainsString($other->session_id, $hidden->getMessage());
            $this->assertStringNotContainsString($other->target, $hidden->getMessage());
        }
    }

    private function launchSession(string $name, AgentRole $role): AgentSession
    {
        $agent = Agent::named($name, $role);
        $session = new AgentSession(TestSelections::sessionColumns());
        $session->agent_id = $agent->id;
        $session->status = SessionStatus::Active;
        $session->save();

        return $session;
    }

    private function publish(AgentSession $session, string $text): SkillPublication
    {
        $markdown = "# Journal\n\n{$text}\n";
        $generation = SkillGeneration::ready(hash('sha256', $text), str_repeat('e', 64), [[
            'key' => 'journal',
            'owner' => 'Core',
            'revision' => null,
            'markdown' => $markdown,
            'digest' => hash('sha256', $markdown),
        ]]);
        $publication = SkillPublication::intend(
            $session->id,
            'claude-code',
            "{$this->root}/targets/{$session->id}/claude-code",
            $generation,
            hash('sha256', $text),
            ['journal'],
        );
        $state = $this->app->make(SkillPublishing::class)->publish($publication->id, 'worker-1');
        $this->assertContains($state, [PublicationState::Delivered, PublicationState::Failed]);

        return $publication->refresh();
    }
}
