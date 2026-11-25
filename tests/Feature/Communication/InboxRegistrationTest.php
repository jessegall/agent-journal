<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Contracts\Inboxes\InboxRegistration;
use App\Contracts\Inboxes\InboxResolver;
use App\Exceptions\InboxProviderInvalid;
use App\Exceptions\InboxUnavailable;
use App\Models\Inboxes\Inbox;
use Illuminate\Database\UniqueConstraintViolationException;
use Tests\Fixtures\Communication\TeamInboxAccess;
use Tests\Fixtures\Communication\TeamInboxProvider;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

final class InboxRegistrationTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_provider_pair_opens_one_inbox(): void
    {
        Inbox::create('team', TestIds::of(1));

        $this->expectException(UniqueConstraintViolationException::class);

        Inbox::create('team', TestIds::of(1));
    }

    public function test_a_registered_provider_resolves_its_inbox_by_id(): void
    {
        $this->app->make(InboxRegistration::class)->register('team', TeamInboxProvider::class, TeamInboxAccess::class);
        $record = Inbox::create('team', TestIds::of(2));

        $inbox = $this->app->make(InboxResolver::class)->resolve($record->id);

        $this->assertSame($record->id, $inbox->inboxId());
    }

    public function test_a_provider_key_registered_twice_is_refused(): void
    {
        $registration = $this->app->make(InboxRegistration::class);
        $registration->register('team', TeamInboxProvider::class, TeamInboxAccess::class);

        $this->expectException(InboxProviderInvalid::class);

        $registration->register('team', TeamInboxProvider::class, TeamInboxAccess::class);
    }

    public function test_an_unknown_inbox_is_unavailable_and_nothing_is_created(): void
    {
        $this->assertThrows(
            fn () => $this->app->make(InboxResolver::class)->resolve(TestIds::of(99)),
            InboxUnavailable::class,
        );
        $this->assertSame(0, Inbox::query()->count());
    }
}
