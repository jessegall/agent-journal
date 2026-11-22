<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Enums\ArrangementType;
use App\Enums\BindingReadiness;
use App\Enums\InvitationMode;
use App\Models\Agent;
use App\Models\Environment;
use App\Models\Host;
use App\Models\InstallAttempt;
use App\Models\Project;
use App\Models\ProjectBinding;
use App\Models\ProjectInvitation;
use App\Values\BindingFolder;
use App\Values\InstallTicket;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Schema;
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

    public function test_the_migrations_make_the_three_tables(): void
    {
        $this->assertTrue(Schema::hasColumns('projects', ['id', 'key', 'label']));
        $this->assertTrue(Schema::hasColumns('project_invitations', [
            'ticket_digest', 'issuer_user_id', 'mode', 'project_id', 'install_attempt_id', 'expires_at', 'revoked_at',
            'spent_at', 'binding_id',
        ]));
        $this->assertTrue(Schema::hasColumns('project_bindings', [
            'host_id', 'project_id', 'main_agent_id', 'root_id', 'canonical_root', 'project_label', 'machine_label',
            'installation_nonce', 'authority_generation', 'readiness', 'last_contact_at', 'presence_expires_at',
            'boot_id', 'report_sequence',
        ]));
    }

    public function test_an_install_line_keeps_only_its_ticket_digest_and_expires_after_its_lifetime(): void
    {
        CarbonImmutable::setTestNow('2026-11-21 12:00:00');
        $invitation = ProjectInvitation::create(
            InstallAttempt::openFor('user-1', 'issue-1', null),
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

    public function test_a_revoked_or_spent_install_line_cannot_be_redeemed(): void
    {
        $project = Project::create('shop', 'Shop');
        $main = Environment::openDefaultOf($project);
        $revoked = ProjectInvitation::create(
            InstallAttempt::openFor('user-1', 'issue-a', $main),
            InstallTicket::digestOf('ticket-a'),
        );
        $spent = ProjectInvitation::create(
            InstallAttempt::openFor('user-1', 'issue-b', $main),
            InstallTicket::digestOf('ticket-b'),
        );

        $revoked->revoke();
        $spent->spendOn($this->binding($project, $main));

        $this->assertSame(InvitationMode::Join, $spent->mode);
        $this->assertSame($project->id, $spent->project_id);
        $this->assertFalse($this->isPending($revoked));
        $this->assertFalse($this->isPending($spent));
        $this->assertNotNull($spent->binding_id);
    }

    public function test_a_new_binding_is_pending_in_its_first_authority_generation(): void
    {
        $project = Project::create('shop', 'Shop');
        $binding = $this->binding($project, Environment::openDefaultOf($project));

        $this->assertSame(1, $binding->authority_generation);
        $this->assertSame(BindingReadiness::Pending, $binding->readinessAt(CarbonImmutable::now()));
    }

    public function test_revoking_a_binding_raises_its_authority_generation(): void
    {
        $project = Project::create('shop', 'Shop');
        $binding = $this->binding($project, Environment::openDefaultOf($project));

        $binding->revoke();

        $this->assertSame(2, $binding->fresh()?->authority_generation);
        $this->assertSame(BindingReadiness::Revoked, $binding->readinessAt(CarbonImmutable::now()));
    }

    private function isPending(ProjectInvitation $invitation): bool
    {
        return ProjectInvitation::query()->pending()->whereKey($invitation->id)->exists();
    }

    private function binding(Project $project, Environment $environment): ProjectBinding
    {
        $host = Host::create('laptop', 'secret-'.bin2hex(random_bytes(4)), [], ArrangementType::Local);
        $agent = Agent::create('Shop main agent', 'main-agent');

        return ProjectBinding::create(
            $host,
            $project,
            $environment,
            $agent,
            new BindingFolder('root-'.bin2hex(random_bytes(4)), '/Users/owner/shop', 'Owner laptop', bin2hex(random_bytes(8))),
        );
    }
}
