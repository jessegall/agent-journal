<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Bus\Contracts\CommandBus;
use App\Bus\Enums\ReceiptState;
use App\Bus\Exceptions\RequestKeyConflict;
use App\Bus\Exceptions\RequestKeyExpired;
use App\Bus\Exceptions\RequestKeyMissing;
use App\Bus\Models\CommandReceipt;
use App\Bus\Support\RequestKey;
use App\Http\Middleware\Web\ReadIdempotencyKey;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Fixtures\Modules\Notes\Commands\KeepNote;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote;
use Tests\Support\TestIds;

/**
 * A user's keyed write is receipted like an agent's, in the user's own key space: it runs once, a changed payload
 * conflicts, a command that requires a key is refused without one, and a key past its retention is refused, then
 * forgotten after its tombstone.
 */
final class OwnerReceiptTest extends CommandBusTestCase
{
    private const string KEY = '01JD8X0G9M3QZ6V4K2OWNERKEY1';

    protected function setUp(): void
    {
        parent::setUp();

        $this->installCommandModules();
        $this->startUserRequestAs(TestIds::of(1));
    }

    protected function tearDown(): void
    {
        $database = $this->app->make(ConnectionInterface::class);

        foreach (['command_receipts', 'launch_credentials', 'agent_sessions', 'agents'] as $table) {
            $database->table($table)->delete();
        }

        parent::tearDown();
    }

    public function test_an_owner_call_with_a_key_runs_once_and_its_repeat_returns_the_same_result(): void
    {
        $this->app->make(RequestKey::class)->set(self::KEY);
        $bus = $this->app->make(CommandBus::class);

        $first = $bus->run(new KeepNote('once'));
        $repeat = $bus->run(new KeepNote('once'));

        $this->assertSame($first, $repeat);
        $this->assertSame(1, $this->rowCount());
        $receipt = CommandReceipt::query()->sole();
        $this->assertSame('user', $receipt->author_type);
        $this->assertNull($receipt->session_id);
        $this->assertSame(KeepNote::class, $receipt->command);
    }

    public function test_a_changed_payload_under_the_same_key_conflicts(): void
    {
        $this->app->make(RequestKey::class)->set(self::KEY);
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new KeepNote('first'));

        $this->assertThrows(fn () => $bus->run(new KeepNote('changed')), RequestKeyConflict::class);
        $this->assertSame(1, $this->rowCount());
    }

    public function test_a_command_that_requires_a_key_is_refused_without_one(): void
    {
        $this->assertThrows(fn () => $this->app->make(CommandBus::class)->run(new KeepNote('keyless')), RequestKeyMissing::class);
        $this->assertSame(0, $this->rowCount());
        $this->assertSame(0, CommandReceipt::query()->count());
    }

    public function test_a_key_past_its_retention_is_refused_and_not_run_again(): void
    {
        $this->app->make(RequestKey::class)->set(self::KEY);
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new KeepNote('kept'));

        $this->travel(32)->days();

        $this->assertThrows(fn () => $bus->run(new KeepNote('kept')), RequestKeyExpired::class);
        $this->assertThrows(fn () => $bus->run(new KeepNote('another')), RequestKeyExpired::class);
        $this->assertSame(1, $this->rowCount());
    }

    public function test_the_prune_expires_a_receipt_past_its_retention_and_removes_it_past_its_tombstone(): void
    {
        $this->app->make(RequestKey::class)->set(self::KEY);
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new KeepNote('kept'));

        $this->travel(32)->days();
        $this->prune();

        $receipt = CommandReceipt::query()->sole();
        $this->assertSame(ReceiptState::Expired, $receipt->state);
        $this->assertNull($receipt->result);
        $this->assertThrows(fn () => $bus->run(new KeepNote('kept')), RequestKeyExpired::class);

        $this->travel(334)->days();
        $this->prune();

        $this->assertSame(0, CommandReceipt::query()->count());
    }

    public function test_a_receipt_without_a_declared_retention_is_removed_after_thirty_days(): void
    {
        $this->app->make(RequestKey::class)->set(self::KEY);
        $this->app->make(CommandBus::class)->run(new WriteNote('standard'));

        $this->travel(31)->days();
        $this->prune();

        $this->assertSame(0, CommandReceipt::query()->count());
    }

    public function test_the_same_key_of_a_user_and_an_agent_names_two_writes(): void
    {
        $this->app->make(RequestKey::class)->set(self::KEY);
        $this->app->make(CommandBus::class)->run(new WriteNote('user'));

        $launch = TestLaunch::start();
        $this->startRequestAs($launch->agent->id, $launch->session->id);
        $this->app->make(CommandBus::class)->run(new WriteNote('agent'));

        $this->assertSame(2, $this->rowCount());
        $this->assertSame(1, CommandReceipt::query()->count());
        $this->assertSame($launch->session->id, CommandReceipt::query()->sole()->session_id);
    }

    public function test_the_idempotency_key_header_keys_the_request(): void
    {
        $request = Request::create('/sharing', 'POST');
        $request->headers->set('Idempotency-Key', self::KEY);

        $keys = $this->app->make(RequestKey::class);
        $seen = null;

        $this->app->make(ReadIdempotencyKey::class)->handle($request, function () use ($keys, &$seen): Response {
            $seen = $keys->key();

            return new Response();
        });

        $this->assertSame(self::KEY, $seen);
        $this->assertNull($keys->key());
    }

    private function prune(): void
    {
        $this->assertSame(0, $this->app->make(Kernel::class)->call('bus:prune-receipts'));
    }
}
