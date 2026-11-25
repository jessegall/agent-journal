<?php

declare(strict_types=1);

namespace Domain\Reminders\Tests\Commands;

use App\Exceptions\RecordUnavailable;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Reminders\Commands\FinishReminder\FinishReminderCommand;
use Domain\Reminders\Enums\ReminderStatus;
use Domain\Reminders\Exceptions\ReminderEnded;
use Domain\Reminders\Models\Reminder;
use Domain\Reminders\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;

/**
 * Its owner finishes an open reminder, which is then done; a finished one cannot be finished again, and another
 * user's reminder is not there for them.
 */
final class FinishReminderTest extends TestCase
{
    use RefreshHookDatabase;

    private Reminder $reminder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->user('Colleague')->owner();
        $this->reminder = Reminder::create(
            ActorIdentity::of($this->journal->ownerUser()),
            'Book the room',
            CarbonImmutable::parse('2026-11-30 09:00'),
        );
    }

    public function test_its_owner_finishes_an_open_reminder_and_it_is_done(): void
    {
        $this->journal->run(new FinishReminderCommand($this->reminder->id));

        $this->assertSame(ReminderStatus::Done, $this->reminder->refresh()->status);
    }

    public function test_a_finished_reminder_cannot_be_finished_again(): void
    {
        $this->journal->run(new FinishReminderCommand($this->reminder->id));

        $this->assertThrows(
            fn () => $this->journal->run(new FinishReminderCommand($this->reminder->id)),
            ReminderEnded::class,
        );
    }

    public function test_another_users_reminder_is_not_there_for_them_and_stays_open(): void
    {
        $this->journal->actAs('Colleague');

        $this->assertThrows(
            fn () => $this->journal->run(new FinishReminderCommand($this->reminder->id)),
            RecordUnavailable::class,
        );
        $this->journal->actAs('Owner');
        $this->assertSame(ReminderStatus::Open, $this->reminder->refresh()->status);
    }
}
