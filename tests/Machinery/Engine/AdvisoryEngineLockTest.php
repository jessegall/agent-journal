<?php

declare(strict_types=1);

namespace Tests\Machinery\Engine;

use App\Exceptions\EngineConnectionLost;
use App\Support\AdvisoryEngineLock;
use App\Support\EngineSettings;
use Illuminate\Database\Connection;
use Illuminate\Database\DatabaseManager;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * One engine process owns the installation: a rival session waits while the lock is held and gets it once it is
 * released, and a terminated engine session loses the lock and never reconnects.
 */
final class AdvisoryEngineLockTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [];

    private const string RIVAL = 'engine_rival';

    private DatabaseManager $databases;

    protected function setUp(): void
    {
        parent::setUp();

        $this->databases = $this->app->make(DatabaseManager::class);
        $config = $this->app->make('config');
        $config->set('database.connections.engine.database', $this->databases->connection()->getDatabaseName());
        $config->set('database.connections.'.self::RIVAL, $config->array('database.connections.engine'));
    }

    protected function tearDown(): void
    {
        $this->databases->purge(self::RIVAL);
        $this->databases->purge('engine');

        parent::tearDown();
    }

    public function test_a_rival_session_cannot_take_the_lock_until_the_owner_releases_it(): void
    {
        $lock = $this->app->make(AdvisoryEngineLock::class);

        $lock->acquire();

        $this->assertTrue($lock->isHeld());
        $this->assertFalse($this->doesRivalTakeTheLock());

        $lock->release();

        $this->assertFalse($lock->isHeld());
        $this->assertTrue($this->doesRivalTakeTheLock());
    }

    public function test_a_terminated_engine_session_loses_the_lock_and_never_reconnects(): void
    {
        $lock = $this->app->make(AdvisoryEngineLock::class);
        $lock->acquire();
        $engine = $this->databases->connection('engine');
        $enginePid = (int) $engine->scalar('select pg_backend_pid()');

        $this->rival()->statement('select pg_terminate_backend(?)', [$enginePid]);

        $this->assertFalse($lock->isHeld());
        $this->assertTrue($this->doesRivalTakeTheLock());
        $this->expectException(EngineConnectionLost::class);
        $engine->scalar('select 1');
    }

    private function doesRivalTakeTheLock(): bool
    {
        return (bool) $this->rival()->scalar(
            'select pg_try_advisory_lock(?)',
            [$this->app->make(EngineSettings::class)->lockKey],
        );
    }

    /**
     * A second session, as a rival engine process would hold; it keeps any lock it takes until the test ends.
     */
    private function rival(): Connection
    {
        return $this->databases->connection(self::RIVAL);
    }
}
