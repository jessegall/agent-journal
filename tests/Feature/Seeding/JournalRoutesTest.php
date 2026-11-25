<?php

declare(strict_types=1);

namespace Tests\Feature\Seeding;

use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Contracts\Actors\CurrentActor;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The journal sends a named route as the user in place or as a guest, and a signed call as an agent's start or a host,
 * each with only its own credential; the selection in place stays afterwards.
 */
final class JournalRoutesTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_owner_beats_and_a_guest_after_it_is_sent_to_sign_in(): void
    {
        $this->journal->owner();

        $this->journal->route('POST', 'actors.presence.heartbeat')->assertNoContent();
        $this->journal->asGuest()->route('POST', 'actors.presence.heartbeat')->assertRedirect('/login');
    }

    public function test_an_admitted_member_reaches_a_member_route_and_no_other(): void
    {
        $this->journal->owner()->user('Sam')->admitInboxMember('Sam')->actAsInboxMember('Sam');

        $this->journal->jsonRoute('POST', 'communication.notifications.read')->assertUnprocessable();
        $this->journal->jsonRoute('POST', 'actors.presence.heartbeat')->assertForbidden();
        $this->assertSame($this->journal->userCalled('Sam')->id, $this->app->make(CurrentActor::class)->actor()->id);
    }

    public function test_an_agent_call_signs_with_its_start_and_an_old_start_is_refused(): void
    {
        $this->journal->owner()->idleAgent('Writer')->startSession('Writer', 'First');
        $this->journal->agentCall('First', 'POST', '/agent/heartbeat', ['request_key' => bin2hex(random_bytes(8))])->assertSuccessful();

        $this->journal->startSession('Writer', 'Second');

        $this->journal->agentCall('First', 'POST', '/agent/heartbeat', ['request_key' => bin2hex(random_bytes(8))])->assertUnauthorized();
        $this->journal->agentCall('Second', 'POST', '/agent/heartbeat', ['request_key' => bin2hex(random_bytes(8))])->assertSuccessful();
    }

    public function test_a_host_call_is_verified_over_its_method_target_and_bytes(): void
    {
        $this->journal->owner();
        $host = $this->journal->asSystem(new EnrollHostCommand('test host', [base_path()]));

        $this->journal->hostCall($host, 'GET', '/host/stop-attempts')->assertOk()->assertExactJson(['attempts' => []]);
        $forged = ['HTTP_X_JOURNAL_CALL_SIGNATURE' => 'forged'];
        $this->journal->hostCall($host, 'GET', '/host/stop-attempts', headers: $forged)->assertUnauthorized();
    }
}
