<?php

declare(strict_types=1);

namespace Tests\Commands\Skills;

use App\Agents\Drivers\ClaudeCode\ClaudeCodeSkills;
use App\Events\Sessions\SessionOpened;
use App\Hooks\Enums\ToolOutcome;
use App\Listeners\AdmitStartSkills;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillReadEntry;
use App\Skills\Commands\RecordSkillRead\RecordSkillReadCommand;
use App\Skills\Enums\ReadEvidence;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Agents\TestSession;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A proven whole read of a skill the session was handed writes one row with its evidence, for each real way an agent
 * reads one on either driver; a read of a skill it was not handed, a partial read, a failed call and a file outside
 * its own runtime prove nothing.
 */
#[TestsCommand(RecordSkillReadCommand::class)]
final class RecordSkillReadTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'skill_reads',
        'skill_generations',
        'command_receipts',
        'agents',
        'agent_sessions',
    ];

    private const string STATE_FOLDER = '/Users/someone/.journal-runner';

    private AgentSession $session;

    private string $key;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Writer');
        $this->journal->refreshSkills();
        $session = $this->journal->sessionOf('Writer');
        $this->app->make(AdmitStartSkills::class)->handle(new SessionOpened($session->agent_id, $session->id));
        $this->session = AgentSession::findById($session->id);
        $this->key = $this->session->skill_keys[0];
    }

    public function test_the_claude_skill_tool_records_one_row_with_its_evidence(): void
    {
        $this->read('Skill', ['skill' => ClaudeCodeSkills::PLUGIN_NAME.":{$this->key}"]);

        $this->assertReadOnce(ReadEvidence::ClaudeSkillTool);
    }

    public function test_a_whole_read_of_the_skill_file_records_a_row_on_claude_code(): void
    {
        $this->read('Read', ['file_path' => $this->claudeFile($this->runtimeId())]);

        $this->assertReadOnce(ReadEvidence::FullFileRead);
    }

    public function test_a_cat_of_the_skill_file_records_a_row_on_both_drivers(): void
    {
        $this->read('Bash', ['command' => 'cat '.$this->claudeFile($this->runtimeId())]);
        $this->read('Bash', ['command' => 'cat "'.$this->codexFile($this->runtimeId()).'"']);

        $this->assertCount(2, SkillReadEntry::findLatestOfSession($this->session->id, 10));
    }

    public function test_skill_show_of_the_key_records_a_row(): void
    {
        $this->read('Bash', ['command' => "php artisan skill:show {$this->key}"]);

        $this->assertReadOnce(ReadEvidence::SkillShow);
    }

    public function test_a_second_read_is_a_second_row(): void
    {
        $this->read('Bash', ['command' => "php artisan skill:show {$this->key}"]);
        $this->read('Bash', ['command' => "php artisan skill:show {$this->key}"]);

        $this->assertCount(2, SkillReadEntry::findLatestOfSession($this->session->id, 10));
    }

    public function test_a_skill_the_session_was_not_handed_records_nothing(): void
    {
        $this->read('Bash', ['command' => 'php artisan skill:show no-such-skill']);
        $this->read('Skill', ['skill' => ClaudeCodeSkills::PLUGIN_NAME.':no-such-skill']);

        $this->assertSame([], SkillReadEntry::findLatestOfSession($this->session->id, 10));
    }

    /**
     * @return iterable<string, array{string, array<string, mixed>}>
     */
    public static function falseReads(): iterable
    {
        yield 'another plugin skill call' => ['Skill', ['skill' => 'other-plugin:KEY']];

        yield 'a partial read' => ['Read', ['file_path' => 'CLAUDE_FILE', 'limit' => 10]];

        yield 'a read from an offset' => ['Read', ['file_path' => 'CLAUDE_FILE', 'offset' => 5]];

        yield 'head of the file' => ['Bash', ['command' => 'head -5 CLAUDE_FILE']];

        yield 'sed of the file' => ['Bash', ['command' => "sed -n '1,20p' CLAUDE_FILE"]];

        yield 'a listing' => ['Bash', ['command' => 'ls RUNTIME_FOLDER']];

        yield 'another runtimes file' => ['Read', ['file_path' => 'OTHER_RUNTIME_FILE']];

        yield 'a dotted path back into the runtime' => ['Read', ['file_path' => 'DOTTED_FILE']];

        yield 'a file outside every runtime' => ['Read', ['file_path' => '/work/project/skills/KEY/SKILL.md']];

        yield 'skill show with more after it' => ['Bash', ['command' => 'php artisan skill:show KEY; echo done']];

        yield 'a disguised path' => ['Bash', ['command' => 'cat "$(echo CLAUDE_FILE)"']];
    }

    /**
     * @param  array<string, mixed>  $arguments
     */
    #[DataProvider('falseReads')]
    public function test_a_false_read_records_nothing(string $tool, array $arguments): void
    {
        $this->read($tool, $this->filled($arguments));

        $this->assertSame([], SkillReadEntry::findLatestOfSession($this->session->id, 10));
    }

    public function test_a_failed_call_records_nothing(): void
    {
        $this->journal->withAgent('Writer', fn (TestAgent $writer) => $writer->session(
            fn (TestSession $session) => $session->finishToolCall(
                'Bash',
                ['command' => "php artisan skill:show {$this->key}"],
                ToolOutcome::Failed,
            ),
        ));

        $this->assertSame([], SkillReadEntry::findLatestOfSession($this->session->id, 10));
    }

    /**
     * @param  array<string, mixed>  $arguments
     */
    private function read(string $tool, array $arguments): void
    {
        $this->journal->withAgent('Writer', fn (TestAgent $writer) => $writer
            ->session(fn (TestSession $session) => $session->finishToolCall($tool, $arguments)));
    }

    private function assertReadOnce(ReadEvidence $evidence): void
    {
        $entries = SkillReadEntry::findLatestOfSession($this->session->id, 10);

        $this->assertCount(1, $entries);
        $this->assertSame($this->key, $entries[0]->skill_key);
        $this->assertSame($evidence, $entries[0]->evidence);
        $this->assertSame($this->session->agent_id, $entries[0]->agent_id);
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    private function filled(array $arguments): array
    {
        $runtime = $this->runtimeId();
        $replacements = [
            'CLAUDE_FILE' => $this->claudeFile($runtime),
            'OTHER_RUNTIME_FILE' => $this->claudeFile('01jd8x0g9m3qz6v4k2t7r5w1zz'),
            'DOTTED_FILE' => $this->codexFile($runtime).'/../SKILL.md',
            'RUNTIME_FOLDER' => self::STATE_FOLDER."/runtimes/{$runtime}",
            'KEY' => $this->key,
        ];

        return array_map(
            fn (mixed $argument) => is_string($argument) ? strtr($argument, $replacements) : $argument,
            $arguments,
        );
    }

    private function runtimeId(): string
    {
        return AgentRuntime::findForSession($this->session->id)?->id ?? $this->fail('The session has no runtime.');
    }

    private function claudeFile(string $runtimeId): string
    {
        return self::STATE_FOLDER."/runtimes/{$runtimeId}/journal-skills/skills/{$this->key}/SKILL.md";
    }

    private function codexFile(string $runtimeId): string
    {
        return self::STATE_FOLDER."/runtimes/{$runtimeId}/skills/{$this->key}/SKILL.md";
    }
}
