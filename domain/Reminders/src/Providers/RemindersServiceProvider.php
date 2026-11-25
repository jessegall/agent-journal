<?php

declare(strict_types=1);

namespace Domain\Reminders\Providers;

use Domain\Reminders\Models\Reminder;
use Domain\Reminders\Resolvers\Support\OwnReminders;
use Illuminate\Support\ServiceProvider;

/**
 * Binds the reader of the caller's own reminders and registers the stable link name of a reminder.
 */
final class RemindersServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->scoped(OwnReminders::class);
    }

    public function boot(): void {}
}
