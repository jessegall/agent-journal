<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Contracts\Actors\CurrentActorSetter;
use App\Exceptions\FolderOutsideProject;
use App\Http\Middleware\ResolveConnectedProject;
use App\Models\Projects\Environment;
use App\Models\Projects\InstallAttempt;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectInvitation;
use App\Support\AgentContext;
use App\Support\ProjectKey;
use App\Support\SignedCall;
use App\Values\InstallTicket;
use App\Values\OwnerAuthority;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\TestCase;

/**
 * Each connected agent call serves its own binding's project on a long-lived worker: successive calls of projects A
 * and B read their own project key, two bindings of A read the same one, and B's agent cannot work in A's folder.
 */
final class ConnectedProjectTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'connection_audits', 'project_invitations', 'install_attempts', 'project_bindings', 'project_environments',
        'projects', 'agent_runtimes', 'agents', 'hosts', 'settings_records', 'users',
    ];

    public function test_successive_calls_of_two_projects_each_read_their_own_project(): void
    {
        $shop = $this->bindingOf('shop-ticket', 'nonce-aaaaaaaaaaaaaaaa');
        $blog = $this->bindingOf('blog-ticket', 'nonce-bbbbbbbbbbbbbbbb');

        $this->assertSame($shop->project->key, $this->projectOfCallBy($shop->main_agent_id));
        $this->assertSame($blog->project->key, $this->projectOfCallBy($blog->main_agent_id));
        $this->assertNotSame($shop->project->key, $blog->project->key);
    }

    public function test_two_bindings_joined_to_one_project_read_the_same_project(): void
    {
        $first = $this->bindingOf('shop-ticket', 'nonce-aaaaaaaaaaaaaaaa');
        ProjectInvitation::create(
            InstallAttempt::create($this->owner->id, 'join-action', $this->mainOf(Project::query()->sole())),
            InstallTicket::digestOf('join-ticket'),
        );
        $second = ProjectBinding::query()->findOrFail(
            $this->redeemLine('join-ticket', 'nonce-cccccccccccccccc')->assertCreated()->json('bindingId'),
        );

        $this->assertSame($this->projectOfCallBy($first->main_agent_id), $this->projectOfCallBy($second->main_agent_id));
        $this->assertNotSame($first->main_agent_id, $second->main_agent_id);
    }

    public function test_an_agent_of_one_project_cannot_work_in_another_projects_folder(): void
    {
        $shop = $this->bindingOf('shop-ticket', 'nonce-aaaaaaaaaaaaaaaa');

        $this->projectOfCallBy($shop->main_agent_id);
        $projects = $this->app->make(ProjectKey::class);
        $projects->assertFolderAllowed($shop->canonical_root.'/src');

        $this->expectException(FolderOutsideProject::class);
        $projects->assertFolderAllowed('/Users/owner/other-project');
    }

    public function test_a_call_with_no_connected_binding_keeps_the_installations_project(): void
    {
        config(['processes.project_key' => 'this-installation']);

        $this->assertSame('this-installation', $this->projectOfCallBy('an-agent-of-this-installation'));
    }

    private function bindingOf(string $ticket, string $nonce): ProjectBinding
    {
        $this->issueLine($ticket);

        return ProjectBinding::query()->with('project')->findOrFail(
            $this->redeemLine($ticket, $nonce)->assertCreated()->json('bindingId'),
        );
    }

    /**
     * The project key an authenticated call of this agent serves, read as a new request on the same worker.
     */
    private function projectOfCallBy(string $agentId): string
    {
        $this->app->forgetScopedInstances();
        $agent = new AgentContext($agentId, 'session', new SignedCall('call', CarbonImmutable::now(), 'digest'), null);
        $this->app->make(CurrentActorSetter::class)->set($agent, new OwnerAuthority('the agent call'));
        $middleware = $this->app->make(ResolveConnectedProject::class);
        $middleware->handle(Request::create('/agent/call'), fn () => new Response());

        return $this->app->make(ProjectKey::class)->current();
    }

    /**
     * The project's Main environment, which its first line made.
     */
    private function mainOf(Project $project): Environment
    {
        return Environment::listedOf($project->id)[0];
    }
}
