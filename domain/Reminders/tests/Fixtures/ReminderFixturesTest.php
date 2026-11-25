<?php

declare(strict_types=1);

namespace Domain\Reminders\Tests\Fixtures;

use App\Exceptions\RecordUnavailable;
use Carbon\CarbonImmutable;
use Domain\Reminders\Commands\FinishReminder\FinishReminderCommand;
use Domain\Reminders\Exceptions\ReminderEnded;
use Domain\Reminders\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;

/**
 * Reminders arranged through the journal are read back as saved: the finished one is done and refuses a second finish,
 * and another owner's reminder, which the first could not reach, stays open.
 */
final class ReminderFixturesTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_created_reminder_is_given_back_and_still_found_by_its_name(): void
    {
        $reminders = $this->journal->owner()->fixtures(ReminderFixtures::class);
        $reminder = $reminders->createReminder('Room', 'Owner', CarbonImmutable::parse('2026-11-30 09:00'));

        $this->assertTrue($reminder->is($reminders->reminderCalled('Room')));
    }

    public function test_the_exact_reminder_is_done_and_another_owners_stays_open(): void
    {
        $due = CarbonImmutable::parse('2026-11-30 09:00');

        $reminders = $this->journal->user('Colleague')->owner()->fixtures(ReminderFixtures::class)
            ->reminder('Room', 'Owner', $due)
            ->reminder('Coffee', 'Colleague', $due);

        $room = $reminders->reminderCalled('Room')->id;

        $this->journal->runAs('Owner', new FinishReminderCommand($room));

        $this->journal->assertRefused(
            ReminderEnded::class,
            fn () => $this->journal->runAs('Owner', new FinishReminderCommand($room)),
        );

        $this->journal->assertRefused(
            RecordUnavailable::class,
            fn () => $this->journal->runAs(
                'Owner',
                new FinishReminderCommand($reminders->reminderCalled('Coffee')->id),
            ),
        );

        $reminders->assertDone('Room')->assertOwnedBy('Room', 'Owner')->assertDueAt('Room', $due);
        $reminders->assertOpen('Coffee')->assertOwnedBy('Coffee', 'Colleague');
    }
}
