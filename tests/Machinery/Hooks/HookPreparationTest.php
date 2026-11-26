<?php

declare(strict_types=1);

namespace Tests\Machinery\Hooks;

use App\Contracts\Files\Files;
use App\Enums\Files\Place;
use App\Support\DefaultDrivers;
use App\Support\Drivers\DriverReply;
use App\Support\Relay\HookRelay;
use App\Support\Relay\PreparationState;
use App\Support\Relay\RelaySettings;
use App\Values\FilePath;
use Illuminate\Support\Facades\Http;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Hooks\JournalUnreachable;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestText;
use Tests\TestCase;

/**
 * The host refuses tool calls until the driver's current context generation is prepared: a never
 * prepared main is refused even during an outage, a prepared main goes on with a logged bypass, a helper is refused
 * during an outage, a session start the journal answers prepares its generation, and an answer for an older
 * generation prepares nothing.
 */
final class HookPreparationTest extends TestCase
{
    use RefreshHookDatabase;

    private const string SHELL = '{"session_id":"session-1","hook_event_name":"PreToolUse","tool_name":"Bash",'
        .'"tool_input":{"command":"git status"}}';

    private const string SESSION_START = '{"session_id":"session-1","hook_event_name":"SessionStart",'
        .'"source":"startup"}';

    private TestStart $start;

    private string $bypassLog;

    protected function setUp(): void
    {
        parent::setUp();

        $this->start = $this->journal->signedStart('Main agent', 'main-agent');
        $this->bypassLog = sys_get_temp_dir().'/hook-preparation-'.getmypid().'.jsonl';
    }

    protected function tearDown(): void
    {
        foreach ([$this->bypassLog, $this->preparationFile()] as $file) {
            if (is_file($file)) {
                unlink($file);
            }
        }

        array_map(unlink(...), glob($this->bypassLog.'.pending/*.json') ?: []);

        parent::tearDown();
    }

    public function test_a_never_prepared_main_is_refused_tools_even_during_an_outage(): void
    {
        Http::fake(fn () => throw JournalUnreachable::now());

        $this->assertEquals(TestText::outages()->preparationPending('PreToolUse'), $this->relay(self::SHELL));
        $this->assertFileDoesNotExist($this->bypassLog);
    }

    public function test_a_session_start_the_journal_answers_prepares_its_generation(): void
    {
        Http::fake(fn () => Http::response(['stdout' => '{}', 'stderr' => '', 'exitCode' => 0]));

        $this->relay(self::SESSION_START);

        $this->assertTrue($this->preparation()->isPrepared());
    }

    public function test_a_session_start_the_journal_cannot_answer_leaves_the_generation_unprepared(): void
    {
        $this->prepare('generation-1');
        Http::fake(fn () => throw JournalUnreachable::now());

        $this->relay(self::SESSION_START);

        $this->assertFalse($this->preparation()->isPrepared());
    }

    public function test_an_answer_for_an_older_generation_prepares_nothing(): void
    {
        $preparation = $this->preparation();
        $preparation->openGeneration('generation-1');
        $preparation->openGeneration('generation-2');

        $preparation->prepare('generation-1');

        $this->assertFalse($preparation->isPrepared());
    }

    private function prepare(string $generation): void
    {
        $this->preparation()->openGeneration($generation);
        $this->preparation()->prepare($generation);
    }

    private function preparation(): PreparationState
    {
        return $this->preparationState();
    }

    private function preparationFile(): string
    {
        return $this->bypassLog.'.preparation.json';
    }

    private function relay(string $payload, bool $passesOutages = true): DriverReply
    {
        $settings = new RelaySettings(
            'http://journal.test',
            $this->start->token,
            $this->start->pin(),
            $passesOutages,
            $this->bypassLog,
        );

        return $this->app->make(HookRelay::class)->relay(DefaultDrivers::CLAUDE_CODE, $payload, $settings);
    }

    /**
     * The preparation file beside the bypass log, in the hook runtime place the relay points at the log's folder.
     */
    private function preparationState(): PreparationState
    {
        config([Place::HookRuntime->rootSetting() => dirname($this->bypassLog)]);

        return new PreparationState(
            $this->app->make(Files::class),
            FilePath::in(Place::HookRuntime, basename($this->bypassLog).'.preparation.json'),
        );
    }
}
