<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Enums\ChatPermission;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Access\Models\EnvironmentUserGrant;
use Domain\Access\Models\User;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Support\ChatAdmissionPolicy;
use Tests\Support\MessagingTestCase;
use Tests\Support\OpensPairChats;

/**
 * Who may be brought into a chat: an admitted user who may receive invitations is a candidate and may be added; a user
 * outside the environment is neither; a revoked grant or a disabled account takes a user out again.
 */
final class ChatAdmissionTest extends MessagingTestCase
{
    use OpensPairChats;

    private Conversation $chat;

    private User $bea;

    private User $cy;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chat = $this->pairChat(ActorIdentity::of($this->owner), $this->actorOf($this->builder));
        $this->bea = User::factory()->create(['name' => 'Bea']);
        $this->cy = User::factory()->create(['name' => 'Cy']);
        EnvironmentUserGrant::create(
            $this->bea,
            null,
            [ChatPermission::ReceiveInvitations],
            ActorIdentity::of($this->owner),
            CarbonImmutable::now(),
        );
    }

    public function test_an_admitted_user_is_a_candidate_and_a_user_outside_is_neither_listed_nor_addable(): void
    {
        $policy = $this->app->make(ChatAdmissionPolicy::class);
        $owner = ActorIdentity::of($this->owner);

        $candidates = $policy->candidates($owner, $this->chat);
        $this->assertContainsEquals(ActorIdentity::of($this->bea), $candidates);
        $this->assertNotContainsEquals(ActorIdentity::of($this->cy), $candidates);
        $this->assertTrue($policy->mayAdd($owner, ActorIdentity::of($this->bea), $this->chat));
        $this->assertFalse($policy->mayAdd($owner, ActorIdentity::of($this->cy), $this->chat));
    }

    public function test_a_revoked_grant_or_a_disabled_account_leaves_the_candidates(): void
    {
        $policy = $this->app->make(ChatAdmissionPolicy::class);
        $owner = ActorIdentity::of($this->owner);

        $this->bea->disable(CarbonImmutable::now());
        $this->assertNotContainsEquals(ActorIdentity::of($this->bea), $policy->candidates($owner, $this->chat));

        $this->bea->enable();
        EnvironmentUserGrant::query()->activeFor($this->bea->id, null)->sole()->revoke(CarbonImmutable::now());
        $this->assertNotContainsEquals(ActorIdentity::of($this->bea), $policy->candidates($owner, $this->chat));
    }

    public function test_a_member_without_the_manage_permission_invites_nobody(): void
    {
        $policy = $this->app->make(ChatAdmissionPolicy::class);

        $this->assertSame([], $policy->candidates($this->actorOf($this->builder), $this->chat));
    }
}
