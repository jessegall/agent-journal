<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Contracts\Inboxes\InboxRegistration;
use App\Contracts\Inboxes\InboxResolver;
use App\Exceptions\InboxProviderInvalid;
use App\Models\Inboxes\Inbox;
use Tests\Fixtures\Communication\TeamInboxProvider;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

final class InboxRegistrationTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_registered_provider_resolves_its_inbox_by_id(): void
    {
        $this->app->make(InboxRegistration::class)->register('team', TeamInboxProvider::class);
        $record = Inbox::create('team', TestIds::of(2), 'Team');

        $inbox = $this->app->make(InboxResolver::class)->resolve($record->id);

        $this->assertSame($record->id, $inbox->inboxId());
    }

    public function test_a_provider_key_registered_twice_is_refused(): void
    {
        $registration = $this->app->make(InboxRegistration::class);
        $registration->register('team', TeamInboxProvider::class);

        $this->expectException(InboxProviderInvalid::class);

        $registration->register('team', TeamInboxProvider::class);
    }
}
