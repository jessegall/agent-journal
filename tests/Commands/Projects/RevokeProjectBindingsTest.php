<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Connections\Enums\BindingReadiness;
use App\Models\Projects\Environment;
use App\Models\Projects\InstallAttempt;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectInvitation;
use App\Projects\Commands\RevokeProjectBindings\RevokeProjectBindingsCommand;
use App\Projects\Values\InstallTicket;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * Several chosen bindings are revoked at once, each with its outcome.
 */
#[TestsCommand(RevokeProjectBindingsCommand::class)]
final class RevokeProjectBindingsTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'command_receipts', 'connection_audits', 'project_invitations', 'install_attempts', 'project_bindings',
        'project_environments', 'projects', 'agent_runtimes', 'agents', 'hosts', 'settings_records', 'users',
    ];

    public function test_several_chosen_bindings_are_revoked_at_once_each_with_its_outcome(): void
    {
        $this->issueLine('ticket-one');
        $first = (string) $this->redeemLine('ticket-one', 'nonce-aaaaaaaaaaaaaaaa')->assertCreated()->json('bindingId');
        ProjectInvitation::create(
            InstallAttempt::create($this->owner->id, 'join-action', $this->mainOf(Project::query()->sole())),
            InstallTicket::digestOf('ticket-two'),
        );
        $second = (string) $this->redeemLine('ticket-two', 'nonce-bbbbbbbbbbbbbbbb')->assertCreated()->json('bindingId');

        $this->journal->asOwner(new RevokeProjectBindingsCommand([$first, $second]));

        $this->assertSame(
            [BindingReadiness::Revoked, BindingReadiness::Revoked],
            ProjectBinding::query()->orderBy('created_at')->get()
                ->map(fn (ProjectBinding $binding) => $binding->readiness)->all(),
        );
    }

    /**
     * The project's Main environment, which its first line made.
     */
    private function mainOf(Project $project): Environment
    {
        return Environment::findListedOfProjects([$project->id])[0];
    }
}
