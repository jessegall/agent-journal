<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Enums\ProjectReadType;
use App\Enums\ProjectWindowState;
use App\Models\Projects\ProjectRead;
use App\Values\ProjectEntry;
use Carbon\CarbonImmutable;
use Closure;
use Domain\Access\Models\User;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\TestCase;

/**
 * The owner's Project window on Home: the tree of the connected folder heard from last, read through its host, with
 * the folders the user opened nested once their reads are answered.
 */
final class ProjectWindowTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'project_reads', 'command_receipts', 'connection_audits', 'project_invitations', 'install_attempts',
        'project_bindings', 'project_environments', 'projects', 'agent_runtimes', 'agents', 'hosts',
        'settings_records', 'users',
    ];

    private const string NONCE = 'nonce-aaaaaaaaaaaaaaaa';

    private const string OPEN_SOURCE = '/?window[connections.project][open][]=src';

    private const string PROP = 'window_connections_project';

    public function test_the_tree_waits_for_the_host_then_nests_the_opened_folder(): void
    {
        $this->readyFolder();

        $this->assertState(ProjectWindowState::Pending);

        $this->answer('', [new ProjectEntry('src', true, 0), new ProjectEntry('README.md', false, 6)]);

        $this->window(fn (AssertableInertia $window) => $window
            ->where(self::PROP.'.data.state', ProjectWindowState::Ready->value)
            ->where(self::PROP.'.data.entries.0.path', 'src')
            ->where(self::PROP.'.data.entries.0.isLoading', true)
            ->where(self::PROP.'.data.entries.1.size', 6));

        $this->answer('src', [new ProjectEntry('main.go', false, 13)]);

        $this->window(fn (AssertableInertia $window) => $window
            ->where(self::PROP.'.data.entries.0.isLoading', false)
            ->where(self::PROP.'.data.entries.0.children.0.path', 'src/main.go'));
    }

    public function test_an_empty_project_is_ready_with_no_entries(): void
    {
        $this->readyFolder();
        $this->assertState(ProjectWindowState::Pending);

        $this->answer('', []);

        $this->window(fn (AssertableInertia $window) => $window
            ->where(self::PROP.'.data.state', ProjectWindowState::Ready->value)
            ->where(self::PROP.'.data.entries', []));
    }

    public function test_a_folder_whose_relay_went_quiet_is_offline_and_none_connected_is_none(): void
    {
        $this->assertState(ProjectWindowState::None);

        $this->readyFolder();
        CarbonImmutable::setTestNow(CarbonImmutable::now()->addHour());

        $this->assertState(ProjectWindowState::Offline);
    }

    public function test_someone_other_than_the_owner_does_not_see_the_window(): void
    {
        $this->assertFalse($this->actingAs(User::factory()->create())->get(self::OPEN_SOURCE)->isOk());
    }

    private function readyFolder(): void
    {
        $this->issueLine('the-ticket');
        $binding = (string) $this->redeemLine('the-ticket', self::NONCE)->assertCreated()->json('bindingId');
        $this->reportClaudeCode(self::NONCE, $binding);
    }

    /**
     * @param  list<ProjectEntry>  $entries
     */
    private function answer(string $path, array $entries): void
    {
        ProjectRead::query()->where('type', ProjectReadType::Directory->value)->where('path', $path)
            ->firstOrFail()->answerWithEntries($entries, false);
    }

    private function assertState(ProjectWindowState $state): void
    {
        $this->window(fn (AssertableInertia $window) => $window->where(self::PROP.'.data.state', $state->value));
    }

    /**
     * @param  Closure(AssertableInertia): AssertableInertia  $assertions
     */
    private function window(Closure $assertions): void
    {
        $this->actingAs($this->owner)->get(self::OPEN_SOURCE)->assertOk()->assertInertia(
            fn (AssertableInertia $page) => $page->reloadOnly([self::PROP], $assertions),
        );
    }
}
