<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\RequestKeyConflict;
use App\Bus\Exceptions\RequestKeyExpired;
use App\Bus\Exceptions\RequestKeyMissing;
use App\Bus\Models\CommandReceipt;
use App\Bus\Support\RequestKey;
use Illuminate\Database\ConnectionInterface;
use Tests\Fixtures\Modules\Notes\Commands\RetainNote;
use Tests\Support\TestIds;

/**
 * A key kept for its actor: another session of the same actor gets the same answer, another actor's same key is
 * its own, a changed payload conflicts, the answer lapses after 30 days while the key stays refused for good, and
 * a call without a key is refused.
 */
final class RetainedRequestKeyTest extends CommandBusTestCase
{
    private const string KEY = '01JD8X0G9M3QZ6V4K2RETAINED1';

    protected function setUp(): void
    {
        parent::setUp();

        $this->installCommandModules();
    }

    protected function tearDown(): void
    {
        $database = $this->app->make(ConnectionInterface::class);

        foreach (['command_receipts', 'module_command_rows'] as $table) {
            $database->table($table)->delete();
        }

        parent::tearDown();
    }

    public function test_another_session_of_the_same_actor_gets_the_same_answer(): void
    {
        $first = $this->retainAs(TestIds::of(1), TestIds::of(10), 'once');
        $again = $this->retainAs(TestIds::of(1), TestIds::of(11), 'once');

        $this->assertSame($first, $again);
        $rows = $this->app->make(ConnectionInterface::class)->table('module_command_rows')->where('text', 'once');
        $this->assertSame(1, $rows->count());
    }

    public function test_another_actor_with_the_same_key_runs_its_own_command(): void
    {
        $first = $this->retainAs(TestIds::of(1), TestIds::of(10), 'mine');
        $other = $this->retainAs(TestIds::of(2), TestIds::of(20), 'mine');

        $this->assertNotSame($first, $other);
    }

    public function test_a_changed_payload_under_the_key_conflicts(): void
    {
        $this->retainAs(TestIds::of(1), TestIds::of(10), 'first');

        $this->expectException(RequestKeyConflict::class);

        $this->retainAs(TestIds::of(1), TestIds::of(11), 'second');
    }

    public function test_after_30_days_the_key_is_refused_and_its_receipt_is_kept(): void
    {
        $this->retainAs(TestIds::of(1), TestIds::of(10), 'old');
        $this->travel(31)->days();

        $this->assertThrows(fn () => $this->retainAs(TestIds::of(1), TestIds::of(11), 'old'), RequestKeyExpired::class);
        $this->assertNull(CommandReceipt::query()->withoutGlobalScopes()->sole()->refuses_until);
    }

    public function test_a_call_without_a_key_is_refused(): void
    {
        $this->startTestAgentRequest(1, 10);

        $this->expectException(RequestKeyMissing::class);

        $this->app->make(CommandBus::class)->run(new RetainNote('no key'));
    }

    private function retainAs(string $agentId, string $sessionId, string $text): int
    {
        $this->app->forgetScopedInstances();
        $this->startRequestAs($agentId, $sessionId);
        $this->app->make(RequestKey::class)->set(self::KEY);

        return $this->app->make(CommandBus::class)->run(new RetainNote($text));
    }
}
