<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Drivers\Enums\HookDriver;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Files\Values\FilePath;
use App\Hooks\Drivers\DriverReply;
use App\Hooks\Drivers\OutageReply;
use App\Hooks\Enums\CallFailure;
use App\Hooks\Relay\HookRelay;
use App\Hooks\Relay\PreparationState;
use App\Hooks\Relay\RelaySettings;
use Illuminate\Support\Facades\Http;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Hooks\JournalUnreachable;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The host refuses tool calls until the driver's current context generation is prepared (task 293): a never
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

        $this->start = TestStart::start('main-agent');
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

        $this->assertEquals(OutageReply::preparationPending('PreToolUse'), $this->relay(self::SHELL));
        $this->assertFileDoesNotExist($this->bypassLog);
    }

    public function test_a_prepared_main_goes_on_during_an_outage_and_a_helper_is_refused(): void
    {
        $this->prepare('generation-1');
        Http::fake(fn () => throw JournalUnreachable::now());

        $main = $this->relay(self::SHELL);
        $helper = $this->relay(self::SHELL, passesOutages: false);

        $this->assertSame('{"hookSpecificOutput":{"hookEventName":"PreToolUse"}}', $main->stdout);
        $this->assertFileExists($this->bypassLog);
        $this->assertEquals(OutageReply::for(CallFailure::Unreachable, false, 'PreToolUse'), $helper);
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

        return $this->app->make(HookRelay::class)->relay(HookDriver::ClaudeCode, $payload, $settings);
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
