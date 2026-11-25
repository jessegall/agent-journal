<?php

declare(strict_types=1);

namespace Domain\Reminders\Tests\Commands;

use App\Exceptions\CommandInputInvalid;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Reminders\Commands\CreateReminder\CreateReminderCommand;
use Domain\Reminders\Enums\ReminderStatus;
use Domain\Reminders\Models\Reminder;
use Domain\Reminders\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\SeedsJournal;

/**
 * A user makes a reminder of their own with its title and due time, open until it is finished; a blank or too long
 * title and a due time that is no date are refused naming the field and make nothing.
 */
final class CreateReminderTest extends TestCase
{
    use RefreshHookDatabase;
    use SeedsJournal;

    private const string DUE_AT = '2026-12-01T09:00:00+00:00';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal()->owner();
    }

    public function test_a_reminder_keeps_its_title_and_due_time_for_its_maker_and_is_open(): void
    {
        $reminderId = $this->journal()->run(new CreateReminderCommand('Read the review', self::DUE_AT));

        $reminder = Reminder::query()->findOrFail($reminderId);
        $this->assertSame(
            ['Read the review', ReminderStatus::Open, ActorIdentity::of($this->journal()->ownerUser())->id],
            [$reminder->title, $reminder->status, $reminder->owningActor()->id],
        );
        $this->assertTrue(CarbonImmutable::parse(self::DUE_AT)->equalTo($reminder->due_at));
    }

    public function test_a_blank_or_too_long_title_and_a_due_time_that_is_no_date_are_refused(): void
    {
        $this->assertThrows(
            fn () => $this->journal()->run(new CreateReminderCommand(' ', self::DUE_AT)),
            CommandInputInvalid::class,
            'title:',
        );
        $this->assertThrows(
            fn () => $this->journal()->run(new CreateReminderCommand(
                str_repeat('a', Reminder::TITLE_CHARACTER_LIMIT + 1),
                self::DUE_AT,
            )),
            CommandInputInvalid::class,
            'title:',
        );
        $this->assertThrows(
            fn () => $this->journal()->run(new CreateReminderCommand('Read the review', 'next week')),
            CommandInputInvalid::class,
            'dueAt:',
        );

        $this->assertSame(0, Reminder::query()->count());
    }
}
