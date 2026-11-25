<?php

declare(strict_types=1);

namespace Domain\Reminders\Tests\Fixtures;

use Carbon\CarbonImmutable;
use Domain\Reminders\Enums\ReminderStatus;
use Domain\Reminders\Models\Reminder;
use PHPUnit\Framework\Assert;
use Tests\Support\Seeding\FixtureAliases;
use Tests\Support\Seeding\JournalSeed;

/**
 * The reminders of named users and agents, kept under the names a test gives them and read back as saved, whoever
 * acts at the time.
 */
final class ReminderFixtures
{
    private readonly FixtureAliases $aliases;

    public function __construct(private readonly JournalSeed $journal)
    {
        $this->aliases = new FixtureAliases('ReminderFixtures');
    }

    /**
     * An open reminder of the named owner, due at that moment, titled after its name unless a title is given.
     */
    public function reminder(string $name, string $owner, CarbonImmutable $dueAt, string|null $title = null): self
    {
        $this->aliases->claim($name);
        $reminder = Reminder::create($this->journal->actorCalled($owner), $title ?? $name, $dueAt);
        $this->aliases->remember($name, $reminder);

        return $this;
    }

    public function reminderCalled(string $name): Reminder
    {
        return $this->aliases->model(Reminder::class, $name);
    }

    public function assertOwnedBy(string $name, string $owner): self
    {
        $reminder = $this->reminderCalled($name);
        $actor = $this->journal->actorCalled($owner);

        Assert::assertSame([$actor->type, $actor->id], [$reminder->actor_type, $reminder->actor_id]);

        return $this;
    }

    public function assertOpen(string $name): self
    {
        return $this->assertStatus($name, ReminderStatus::Open);
    }

    public function assertDone(string $name): self
    {
        return $this->assertStatus($name, ReminderStatus::Done);
    }

    public function assertDueAt(string $name, CarbonImmutable $dueAt): self
    {
        Assert::assertTrue($dueAt->equalTo($this->reminderCalled($name)->due_at), "{$name} is due at another time.");

        return $this;
    }

    private function assertStatus(string $name, ReminderStatus $status): self
    {
        Assert::assertSame($status, $this->reminderCalled($name)->status, "The reminder {$name} is in another state.");

        return $this;
    }
}
