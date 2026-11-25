<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Fixtures;

use App\Contracts\Bus\Command;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Agents\ConversationModeType;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperMessage;
use Domain\Helpers\Models\HelperNotice;
use Domain\Helpers\Models\HelperPurpose;
use Domain\Helpers\Support\HelperLifecycleEntry;
use Domain\Helpers\Values\SessionStartDetails;
use Illuminate\Support\Str;
use PHPUnit\Framework\Assert;
use Tests\Support\Seeding\FixtureAliases;
use Tests\Support\Seeding\TestJournal;

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
        $identity = HelperIdentity::create($owner, $helper, self::PROFILE, self::PROFILE);
        $purpose = HelperPurpose::findFree($owner, self::PROFILE, "{$name} work");
        $job = HelperJob::create($identity, $purpose, $owner, $brief, [], self::startDetails((string) Str::ulid()));
        $this->aliases->remember($name, $job);

        return $this;
    }

    /**
     * Runs a step of a job's life as the journal does when it hears of the helper's start or stop.
     *
     * @param  Command<mixed>  $command
     */
    public function runLifecycle(Command $command): self
    {
        $this->journal->runAsJournal(CommandEntry::Application, HelperLifecycleEntry::NAME, $command);

        return $this;
    }

    /**
     * A job started for the request on revision 1 of its profile, on a reused identity in a new conversation.
     */
    public static function startDetails(string $requestId): SessionStartDetails
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
     * The job's parent was told of it with exactly this text.
     */
    public function assertNotice(string $job, string $text): self
    {
        $notices = HelperNotice::query()
            ->acrossActors()
            ->where('helper_job_id', $this->jobCalled($job)->id)
            ->pluck('text')
            ->all();

        Assert::assertContains($text, $notices, "The parent of {$job} was not told so.");

        return $this;
    }
}
