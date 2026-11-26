<?php

declare(strict_types=1);

namespace Tests\Architecture\Seeding;

use App\Contracts\Actors\CurrentActor;
use App\Support\Access\AccessSettings;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\TestCase;

/**
 * The journal has one owner, acts as users, admitted inbox members or no one, and never makes an ordinary user the
 * owner by acting as it.
 */
final class JournalActorsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_second_owner_is_refused(): void
    {
        $this->journal->owner();

        $this->expectExceptionObject(FixtureRefused::secondOwner());

        $this->journal->owner('Other');
    }

    public function test_acting_as_a_user_keeps_the_owner_the_owner(): void
    {
        $this->journal->owner()->user('Sam')->actAs('Sam');

        $this->assertSame($this->journal->ownerUser()->id, $this->app->make(AccessSettings::class)->ownerId);
        $this->assertSame($this->journal->userCalled('Sam')->id, $this->app->make('auth')->guard()->id());
    }

    public function test_a_created_user_is_given_back_and_still_found_by_its_name(): void
    {
        $user = $this->journal->owner()->createUser('Sam');

        $this->assertTrue($user->is($this->journal->userCalled('Sam')));
    }

    public function test_only_an_admitted_user_acts_as_an_inbox_member(): void
    {
        $this->journal->owner()->user('Sam')->user('Kim')->admitInboxMember('Sam');

        $this->journal->actAsInboxMember('Sam');

        $this->assertSame($this->journal->userCalled('Sam')->id, $this->app->make(CurrentActor::class)->actor()->id);
        $this->expectExceptionObject(FixtureRefused::missingAlias('admitted inbox member', 'Kim', 'The journal'));
        $this->journal->actAsInboxMember('Kim');
    }

    public function test_a_guest_has_no_one_signed_in_and_is_sent_to_sign_in(): void
    {
        $this->journal->owner()->asGuest();

        $this->assertNull($this->app->make('auth')->guard()->id());
        $this->get('/')->assertRedirect('/login');
    }
}
