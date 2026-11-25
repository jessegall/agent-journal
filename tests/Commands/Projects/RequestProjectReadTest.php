<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Hosts\ProjectFiles;
use App\Enums\Projects\ProjectReadStatus;
use App\Enums\Projects\ProjectReadType;
use App\Exceptions\CommandNotRegistered;
use App\Exceptions\ProjectReadRefused;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Projects\Environment;
use App\Models\Projects\Host;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectRead;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Support\EnrolledHost;
use App\Values\BindingFolder;
use App\Values\InboxMemberAuthority;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The owner asks for a read of the project: it is pending until the host answers, the same question asked again reuses
 * the recent read, a member who is not the owner may not read, and a path over the limit is refused by name.
 */
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
        $this->assertSame(ProjectReadStatus::Pending, $pending->state);

        $read = ProjectRead::query()->findOrFail($pending->readId);
        $this->reportText($read)->assertNoContent();
        $this->journal->actAsUserId(TestIds::of(7));

        $answered = $files->file($this->binding, 'src/main.go');
        $this->assertSame($pending->readId, $answered->readId);
        $this->assertSame(ProjectReadStatus::Answered, $answered->state);
        $this->assertSame(self::SOURCE, $answered->text);
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

    private function requester(): ActorIdentity
    {
        return ActorIdentity::ofClass(User::class, '01jqzr0000000000000000user');
    }

    private function reportText(ProjectRead $read): TestResponse
    {
        return $this->notify($read, $this->textAnswer());
    }

    /**
     * @return array<string, mixed>
     */
    private function textAnswer(): array
    {
        return ['text' => self::SOURCE, 'digest' => hash('sha256', self::SOURCE), 'size' => strlen(self::SOURCE)];
    }

    /**
     * @param  array<string, mixed>  $answer
     */
    private function notify(ProjectRead $read, array $answer): TestResponse
    {
        return $this->journal->hostCall($this->host, 'POST', "/host/reports/project-reads/{$read->id}", $answer);
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
