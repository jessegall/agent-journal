<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\AgentRequests\Support\StartProfilePin;
use App\Agents\Enums\OfflineReplyMode;
use App\Agents\Support\OfflineReplySeal;
use Illuminate\Support\Facades\Process;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The hook command a started program runs needs only its start environment and PHP: with the database and Redis
 * the journal's .env names out of reach, it still relays the call and answers with the start's offline reply.
 */
final class HookRelayScriptTest extends TestCase
{
    private string $bypassLog;

    protected function setUp(): void
    {
        parent::setUp();

        $this->bypassLog = sys_get_temp_dir().'/journal-hook-'.bin2hex(random_bytes(6)).'.log';
    }

    protected function tearDown(): void
    {
        @unlink($this->bypassLog);

        parent::tearDown();
    }

    #[TimeLimit(seconds: 20, reason: 'It boots the application in a child process, as the started program does.')]
    public function test_the_hook_command_relays_with_the_database_and_redis_unreachable(): void
    {
        $result = Process::env($this->startEnvironment())
            ->input('{"session_id":"session-1","hook_event_name":"Stop"}')
            ->timeout(20)
            ->run([base_path('bin/journal-hook'), 'claude-code']);

        $this->assertSame(0, $result->exitCode(), $result->errorOutput());
        $this->assertSame('{}', trim($result->output()));
        $this->assertStringContainsString('"failure":"unreachable"', (string) file_get_contents($this->bypassLog));
    }

    /**
     * A neutral offline reply sealed for this start, a journal that refuses connections, and every service the
     * application could reach pointed at hosts that do not resolve, with the services set as the journal's .env sets
     * them.
     *
     * @return array<string, string>
     */
    private function startEnvironment(): array
    {
        $key = (string) config('app.key');
        $profile = new StartProfilePin('main-agent', 1);
        $seal = new OfflineReplySeal($key)->seal('start-token', $profile, OfflineReplyMode::Neutral);

        return [
            'APP_KEY' => $key,
            'JOURNAL_URL' => 'http://127.0.0.1:1',
            'JOURNAL_START_TOKEN' => 'start-token',
            'JOURNAL_PROFILE' => 'main-agent',
            'JOURNAL_PROFILE_REVISION' => '1',
            'JOURNAL_OFFLINE_REPLY' => OfflineReplyMode::Neutral->value,
            'JOURNAL_OFFLINE_REPLY_SEAL' => $seal,
            'JOURNAL_BYPASS_LOG' => $this->bypassLog,
            'DB_HOST' => 'database.unreachable.invalid',
            'REDIS_HOST' => 'redis.unreachable.invalid',
            'CACHE_STORE' => 'redis',
            'SESSION_DRIVER' => 'redis',
            'QUEUE_CONNECTION' => 'redis',
        ];
    }
}
