<?php

declare(strict_types=1);

namespace App\Agents\Providers;

use App\Actors\Contracts\ActorProviderRegistration;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActiveActorCounterRegistry;
use App\AgentRequests\Actions\SendAgentRequests;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\AgentRequests\Contracts\LaunchCredentialSource;
use App\AgentRequests\Support\AgentClientSettings;
use App\AgentRequests\Support\EnvironmentCredentialSource;
use App\Agents\Console\EnrollHostCommand;
use App\Agents\Console\RetireAgentCommand;
use App\Agents\Console\RunKeyScriptCommand;
use App\Agents\Contracts\HelperImages;
use App\Agents\Contracts\HostCapabilities;
use App\Agents\Contracts\LaunchMaterialReader;
use App\Agents\Contracts\LaunchRecordReader;
use App\Agents\Contracts\ProgramConversationReader;
use App\Agents\Exceptions\AgentContextMissing;
use App\Agents\Readers\AgentAuthorityRecords;
use App\Agents\Readers\HostLaunchMaterial;
use App\Agents\Readers\LaunchRecords;
use App\Agents\Readers\ProgramConversationRecords;
use App\Agents\Readers\RecordedHostCapabilities;
use App\Agents\Readers\VerifiedHelperImages;
use App\Agents\Support\AgentActivity;
use App\Agents\Support\AgentActors;
use App\Agents\Support\AgentAssignees;
use App\Agents\Support\AgentContext;
use App\Agents\Support\AgentSessionCounter;
use App\Agents\Support\DatabaseLaunchTransaction;
use App\Agents\Support\HostCapacity;
use App\Agents\Support\RequestSession;
use App\Agents\Support\RolePermissionReader;
use App\Assignments\Contracts\AgentAuthority;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Support\AssigneeRegistration;
use App\Bus\Contracts\CallerSession;
use App\Contracts\LaunchTransaction;
use App\Processes\Contracts\CommandPermissionReader;
use Illuminate\Support\ServiceProvider;

/**
 * Gives each request its own agent context, which only the agent middleware fills; without it, asking for one fails. A launch runs in a plain transaction until another domain supplies a bounded one. Agents are registered as holders of
 * assigned work, and their present sessions are counted for ActiveActors.
 */
final class AgentsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(CommandPermissionReader::class, RolePermissionReader::class);
        $this->app->scoped(AgentContext::class, fn () => throw AgentContextMissing::forRequest());
        $this->app->scoped(AgentAssignees::class);
        $this->app->bind(AgentAuthority::class, AgentAuthorityRecords::class);
        $this->app->bind(LaunchRecordReader::class, LaunchRecords::class);
        $this->app->bind(ProgramConversationReader::class, ProgramConversationRecords::class);
        $this->app->bind(HelperImages::class, fn () => new VerifiedHelperImages(base_path('docs/accounts/helper-image.json')));
        $this->app->singleton(HostCapacity::class, fn () => new HostCapacity(
            $this->app->make('config')->integer('agents.host_capacity.cpu_cores'),
            $this->app->make('config')->integer('agents.host_capacity.memory_bytes'),
            $this->app->make('config')->integer('agents.host_capacity.disk_bytes'),
        ));
        $this->app->scoped(HostLaunchMaterial::class);
        $this->app->bind(LaunchMaterialReader::class, HostLaunchMaterial::class);
        $this->app->bind(HostCapabilities::class, fn () => new RecordedHostCapabilities(base_path('docs/accounts/container-capabilities.json')));
        $this->app->bindIf(LaunchTransaction::class, DatabaseLaunchTransaction::class);
        $this->app->bind(LaunchCredentialSource::class, fn () => new EnvironmentCredentialSource(array_filter(getenv(), is_string(...))));
        $this->app->bind(AgentClientSettings::class, fn ($app) => $app->make(LaunchCredentialSource::class)->forThisLaunch());
        $this->app->bind(AgentRequestSender::class, SendAgentRequests::class);
        $this->app->bind(CallerSession::class, RequestSession::class);
    }

    public function boot(AssignmentRegistration $assignments, ActorProviderRegistration $actors, ActiveActorCounterRegistry $presentActors): void
    {
        $actors->register(ActorType::Agent, AgentActors::class);
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/agents.php');
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/host.php');
        $this->commands([RetireAgentCommand::class, EnrollHostCommand::class, RunKeyScriptCommand::class]);
        $assignments->registerAssignees(
            new AssigneeRegistration(ActorType::Agent, AgentAssignees::class, AgentActivity::class),
        );
        $presentActors->register(AgentSessionCounter::class);
    }
}
