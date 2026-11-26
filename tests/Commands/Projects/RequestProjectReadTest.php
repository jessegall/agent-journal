<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Access\AccessSettings;
use App\Actors\Contracts\CurrentActorSetter;
use App\Bus\Exceptions\CommandNotRegistered;
use App\Hosts\Contracts\ProjectFiles;
use App\Hosts\EnrolledHost;
use App\Hosts\Enums\HostOrderType;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Hosts\HostOrder;
use App\Models\Projects\Environment;
use App\Models\Projects\Host;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectRead;
use App\Projects\Commands\NotifyProjectRead\NotifyProjectReadCommand;
use App\Projects\Commands\RequestProjectRead\RequestProjectReadCommand;
use App\Projects\Enums\ProjectReadStatus;
use App\Projects\Enums\ProjectReadType;
use App\Projects\Exceptions\ProjectReadRefused;
use App\Projects\Values\BindingFolder;
use App\Projects\Values\ProjectFileText;
use App\Support\ActorReference;
use App\Values\InboxMemberAuthority;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The owner asks for a read of the project: it is pending until the host answers, the same question asked again reuses
 * the recent read, a member who is not the owner may not read, and a path over the limit is refused by name.
 */
#[TestsCommand(RequestProjectReadCommand::class)]
final class RequestProjectReadTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'project_reads', 'project_bindings', 'project_environments', 'projects', 'agent_runtimes', 'agents', 'hosts',
        'hook_calls',
    ];

    private const string SOURCE = "package main\n";

    private EnrolledHost $host;

    private ProjectBinding $binding;

    protected function setUp(): void
    {
        parent::setUp();

        $this->host = $this->journal->enrolledHost();
        $this->binding = $this->bindingOn($this->host);
    }

    public function test_the_same_question_asked_again_reuses_the_recent_read(): void
    {
        $read = $this->read(ProjectReadType::File, 'src/main.go');

        $recent = ProjectRead::findRecentOf(
            $this->binding,
            ProjectReadType::File,
            'src/main.go',
            $this->requester(),
            CarbonImmutable::now(),
        );

        $this->assertSame($read->id, $recent->get()->id);
    }

    public function test_the_owner_gets_a_pending_read_then_the_hosts_answer_and_asking_again_reuses_it(): void
    {
        $this->ownedBy(7);
        $files = $this->app->make(ProjectFiles::class);
        $this->journal->actAsUserId(TestIds::of(7));

        $pending = $files->file($this->binding, 'src/main.go');
        $this->assertSame(ProjectReadStatus::Pending, $pending->status);

        $read = ProjectRead::query()->findOrFail($pending->readId);
        $this->notifyText($read);
        $this->journal->actAsUserId(TestIds::of(7));

        $answered = $files->file($this->binding, 'src/main.go');
        $this->assertSame($pending->readId, $answered->readId);
        $this->assertSame(ProjectReadStatus::Answered, $answered->status);
        $this->assertSame(self::SOURCE, $answered->text);
    }

    public function test_a_new_read_is_ordered_to_the_bindings_host_and_one_asked_again_is_not(): void
    {
        $this->ownedBy(7);
        $this->journal->actAsUserId(TestIds::of(7));
        $files = $this->app->make(ProjectFiles::class);

        $read = $files->file($this->binding, 'src/main.go');
        $files->file($this->binding, 'src/main.go');

        $order = HostOrder::query()->where('type', HostOrderType::ReadProject->value)->sole();
        $payload = $this->journal->payloadOf($order);
        $this->assertSame(
            [$this->host->hostId, null, $read->readId, 'src/main.go'],
            [$order->host_id, $order->host_process_id, $payload['id'], $payload['path']],
        );
    }

    public function test_a_signed_in_member_who_is_not_the_owner_may_not_read_the_project(): void
    {
        $this->ownedBy(8);
        $this->app->make(CurrentActorSetter::class)->set(
            TestActors::user(7),
            new InboxMemberAuthority('the web sign-in'),
        );

        $this->expectException(CommandNotRegistered::class);

        $this->app->make(ProjectFiles::class)->folders($this->binding, ['']);
    }

    public function test_a_path_over_the_limit_is_refused_by_name(): void
    {
        $this->ownedBy(7);
        $this->journal->actAsUserId(TestIds::of(7));

        $this->expectException(ProjectReadRefused::class);

        $this->app->make(ProjectFiles::class)->file(
            $this->binding,
            str_repeat('a', ProjectRead::PATH_CHARACTER_LIMIT + 1),
        );
    }

    private function ownedBy(int $userNumber): void
    {
        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of($userNumber)));
    }

    private function read(ProjectReadType $type, string $path): ProjectRead
    {
        return ProjectRead::create($this->binding, $type, $path, $this->requester());
    }

    private function requester(): ActorReference
    {
        return ActorReference::ofClass(User::class, '01jqzr0000000000000000user');
    }

    private function notifyText(ProjectRead $read): void
    {
        $this->journal->asSystem(new NotifyProjectReadCommand(
            $this->host->hostId,
            $read->id,
            [],
            new ProjectFileText(self::SOURCE, hash('sha256', self::SOURCE), strlen(self::SOURCE)),
            false,
            null,
        ));
    }

    private function bindingOn(EnrolledHost $host): ProjectBinding
    {
        $project = Project::create('shop', 'Shop');

        return ProjectBinding::create(
            Host::query()->findOrFail($host->hostId),
            $project,
            Environment::createForDefault($project),
            Agent::create('Shop main agent', 'main-agent', $project),
            new BindingFolder('root-'.Str::random(6), '/Users/owner/shop', 'Owner laptop', Str::random(16)),
        );
    }
}
