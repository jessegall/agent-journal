<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Commands\Projects\ClaimProjectReads\ClaimProjectReadsCommand;
use App\Commands\Projects\NotifyProjectRead\NotifyProjectReadCommand;
use App\Enums\Projects\ProjectReadStatus;
use App\Enums\Projects\ProjectReadType;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Projects\Environment;
use App\Models\Projects\Host;
use App\Models\Projects\Project;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectRead;
use App\Support\ActorReference;
use App\Support\EnrolledHost;
use App\Values\BindingFolder;
use App\Values\ProjectFileText;
use App\Values\ProjectReadClaim;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A host claims a read of its own project once, and its report answers it.
 */
#[TestsCommand(ClaimProjectReadsCommand::class)]
final class ClaimProjectReadsTest extends TestCase
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

    public function test_a_claim_hands_a_read_to_its_own_host_once_and_a_report_answers_it(): void
    {
        $read = $this->read(ProjectReadType::File, 'src/main.go');
        $other = $this->journal->enrolledHost();

        $this->assertSame([], $this->claimedReadIds($other));
        $this->assertSame([$read->id], $this->claimedReadIds($this->host));
        $this->assertSame([], $this->claimedReadIds($this->host));

        $this->journal->asSystem(new NotifyProjectReadCommand(
            $this->host->hostId,
            $read->id,
            [],
            new ProjectFileText(self::SOURCE, hash('sha256', self::SOURCE), strlen(self::SOURCE)),
            false,
            null,
        ));

        $answered = ProjectRead::query()->findOrFail($read->id);
        $this->assertSame(ProjectReadStatus::Answered, $answered->status);
        $this->assertSame(self::SOURCE, $answered->text);
        $this->assertSame(hash('sha256', self::SOURCE), $answered->digest);
    }

    private function read(ProjectReadType $type, string $path): ProjectRead
    {
        return ProjectRead::create($this->binding, $type, $path, $this->requester());
    }

    private function requester(): ActorReference
    {
        return ActorReference::ofClass(User::class, '01jqzr0000000000000000user');
    }

    /**
     * @return list<string>
     */
    private function claimedReadIds(EnrolledHost $host): array
    {
        $claims = $this->journal->asSystem(new ClaimProjectReadsCommand($host->hostId))->claims;

        return array_map(fn (ProjectReadClaim $claim) => $claim->id, $claims);
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
