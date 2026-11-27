<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Fixtures;

use App\Accounts\Enums\CommandEntry;
use App\Agents\DriverCatalogue;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Bus\Contracts\Command;
use App\Sessions\OwnerStartReceipt;
use App\Sessions\StartReceipt;
use App\Values\ModelSelection;
use App\Values\SelectedDriver;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperMessage;
use Domain\Helpers\Models\HelperPurpose;
use Domain\Helpers\Support\HelperLifecycleEntry;
use Domain\Helpers\Values\HelperReceipt;
use Domain\Helpers\Values\SessionStartDetails;
use Illuminate\Support\Str;
use PHPUnit\Framework\Assert;
use Tests\Support\Seeding\FixtureAliases;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * Helper jobs kept under the names a test gives them: each job has a writing helper of its own, an agent the journal
 * names after the job, on a free purpose of its parent, and its life goes on through the journal's own lifecycle.
 */
final class HelperFixtures
{
    private const string PROFILE = 'writing-helper';

    private readonly FixtureAliases $aliases;

    public function __construct(private readonly TestJournal $journal)
    {
        $this->aliases = new FixtureAliases('HelperFixtures');
    }

    /**
     * An accepted job of the named parent for a new writing helper, the agent "<name> helper", for a new request.
     */
    public function openJob(string $name, string $parent, string $brief = 'Fix the test'): self
    {
        $this->aliases->claim($name);
        $owner = $this->journal->actorCalled($parent);
        $helper = $this->journal->idleAgent("{$name} helper", self::PROFILE)->actorCalled("{$name} helper");
        $projectId = TestProjects::local()->id;
        $identity = HelperIdentity::create($projectId, $owner, $helper, self::PROFILE, self::PROFILE);
        $purpose = HelperPurpose::findFree($projectId, $owner, self::PROFILE, "{$name} work");
        $job = HelperJob::create($identity, $purpose, $owner, $brief, [], self::startDetails((string) Str::ulid()));
        $this->aliases->remember($name, $job);

        return $this;
    }

    /**
     * Runs a step of a job's life as the journal does when it receives of the helper's start or stop.
     *
     * @param  Command<mixed>  $command
     */
    public function runLifecycle(Command $command): self
    {
        $this->journal->runAsJournal(CommandEntry::Application, HelperLifecycleEntry::NAME, $command);

        return $this;
    }

    /**
     * The receipt a dispatch of the job hands back: a reused job of the writing-helper profile, started in a new
     * conversation on Claude Code.
     */
    public function receiptOf(string $job): HelperReceipt
    {
        $start = new OwnerStartReceipt(
            (string) Str::ulid(),
            SelectedDriver::resolve(
                'claude-code',
                ModelSelection::named('claude-sonnet-5-5'),
                null,
                null,
                null,
                $this->journal->service(DriverCatalogue::class)
            ),
            true,
            ConversationModeType::New,
            ExecutionModeType::RequiredContainer,
            null,
            StartReceipt::ACTUAL_MODEL_NOT_REPORTED,
        );

        return $this->jobCalled($job)->receipt(self::PROFILE, $start, false);
    }

    public function jobCalled(string $name): HelperJob
    {
        return $this->aliases->model(HelperJob::class, $name);
    }

    public function identityOf(string $job): HelperIdentity
    {
        return HelperIdentity::query()->acrossActors()->findOrFail($this->jobCalled($job)->helper_identity_id);
    }

    public function assertJob(string $name, string $parent, string $brief): self
    {
        $job = $this->jobCalled($name);
        $owner = $this->journal->actorCalled($parent);

        Assert::assertSame([$owner->type, $owner->id, $brief], [$job->actor_type, $job->actor_id, $job->brief]);

        return $this;
    }

    /**
     * The live job holds exactly these steering lines, in the order they reached it.
     *
     * @param  list<string>  $lines
     */
    public function assertSteering(string $job, array $lines): self
    {
        Assert::assertSame($lines, $this->jobCalled($job)->steering, "The job {$job} was steered otherwise.");

        return $this;
    }

    /**
     * A message from the named sender waits for the job's helper, which had no live job to take it.
     */
    public function assertPendingSteering(string $job, string $sender, string $text): self
    {
        $from = $this->journal->actorCalled($sender);

        $waiting = HelperMessage::query()
            ->acrossActors()
            ->where('helper_identity_id', $this->identityOf($job)->id)
            ->where('actor_type', $from->type)
            ->where('actor_id', $from->id)
            ->where('text', $text)
            ->count();

        Assert::assertSame(1, $waiting, "No message from {$sender} waits for the helper of {$job}.");

        return $this;
    }

    /**
     * A job started for the request on revision 1 of its profile, on a reused identity in a new conversation.
     */
    private static function startDetails(string $requestId): SessionStartDetails
    {
        return new SessionStartDetails(
            $requestId,
            hash('sha256', $requestId),
            1,
            false,
            false,
            ConversationModeType::New,
            '',
        );
    }
}
