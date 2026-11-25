<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Enums\Connections\BindingReadiness;
use App\Enums\Projects\ArrangementType;
use App\Enums\Projects\InvitationMode;
use App\Exceptions\AgentOfAnotherProject;
use App\Models\Agents\Agent;
use App\Models\Projects\Environment;
use App\Models\Projects\Host;
use App\Models\Projects\InstallAttempt;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectInvitation;
use App\Values\BindingFolder;
use App\Values\InstallTicket;
use Carbon\CarbonImmutable;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * Connected projects, their install lines and their bindings are recorded, each row changed by its own methods.
 */
final class ProjectRecordsTest extends TestCase
{
    use CommitsHookRows;

    private const string EXPIRES_AT = '2026-11-21 12:10:00';

    private const array TABLES = [
        'project_invitations', 'install_attempts', 'project_bindings', 'project_environments', 'projects',
        'agent_runtimes', 'agents', 'hosts',
    ];

    public function test_an_install_line_keeps_only_its_ticket_digest_and_expires_after_its_lifetime(): void
    {
        CarbonImmutable::setTestNow('2026-11-21 12:00:00');
        $invitation = ProjectInvitation::create(
            InstallAttempt::create('user-1', 'issue-1', null),
            InstallTicket::digestOf('the-ticket'),
        );

        $this->assertSame(InstallTicket::digestOf('the-ticket'), $invitation->ticket_digest);
        $this->assertSame(InvitationMode::New, $invitation->mode);
        $this->assertSame(self::EXPIRES_AT, $invitation->expires_at->toDateTimeString());
        CarbonImmutable::setTestNow('2026-11-21 12:09:59');
        $this->assertTrue($this->isPending($invitation));
        CarbonImmutable::setTestNow('2026-11-21 12:10:00');
        $this->assertFalse($this->isPending($invitation));
        $this->assertSame(10, ProjectInvitation::LIFETIME_MINUTES);
    }

    public function test_a_new_binding_is_pending_in_its_first_authority_generation(): void
    {
        $project = Project::create('shop', 'Shop');
        $binding = $this->binding($project, Environment::createForDefault($project));

        $this->assertSame(1, $binding->authority_generation);
        $this->assertSame(BindingReadiness::Pending, $binding->readinessAt(CarbonImmutable::now()));
    }

    public function test_a_binding_refuses_a_main_agent_of_another_project(): void
    {
        $project = Project::create('shop', 'Shop');
        $environment = Environment::createForDefault($project);
        $host = Host::create('laptop', 'secret-'.bin2hex(random_bytes(4)), [], ArrangementType::Local);
        $blog = Project::create('blog', 'Blog');
        $stranger = Agent::create('Blog main agent', 'main-agent', $blog);

        $this->assertThrows(
            fn () => ProjectBinding::create(
                $host,
                $project,
                $environment,
                $stranger,
                new BindingFolder('root-shop', '/Users/owner/shop', 'Owner laptop', 'nonce-shop'),
            ),
            AgentOfAnotherProject::class,
        );
        $this->assertSame(0, ProjectBinding::query()->count());
    }

    private function isPending(ProjectInvitation $invitation): bool
    {
        return ProjectInvitation::query()->pending()->whereKey($invitation->id)->exists();
    }

    private function binding(Project $project, Environment $environment): ProjectBinding
    {
        $host = Host::create('laptop', 'secret-'.bin2hex(random_bytes(4)), [], ArrangementType::Local);
        $agent = Agent::create('Shop main agent', 'main-agent', $project);

        return ProjectBinding::create(
            $host,
            $project,
            $environment,
            $agent,
            new BindingFolder('root-'.bin2hex(random_bytes(4)), '/Users/owner/shop', 'Owner laptop', bin2hex(random_bytes(8))),
        );
    }
}
