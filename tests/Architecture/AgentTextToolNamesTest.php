<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Contracts\Domains\JournalToolNames;
use App\Mcp\Tools\CommandRequestProveTool;
use App\Mcp\Tools\CommandRequestSampleTool;
use App\Mcp\Tools\CommandRequestShowTool;
use App\Mcp\Tools\CommandTypeProposeTool;
use App\Mcp\Tools\OutputsReadTool;
use Domain\Helpers\Mcp\Tools\ContinueHelperTool;
use Domain\Helpers\Mcp\Tools\SendHelperTool;
use Tests\Architecture\Support\DomainFiles;

/**
 * Agents use the journal through its tools, and the command line is for the user at a terminal: no text in app, a
 * domain or the agent texts names a journal command line, except the files that write for the user's terminal.
 */
final class AgentTextToolNamesTest extends TestCase
{
    private const string COMMAND_LINE = '/\bjournal (?:helper|skill|memory|question|plan|phase|task|message|reader|'
        .'command-type|command-request|output|doc|report|sequence|reminder|rule|check|worker|proof|agent|alias) [a-z]/';

    /**
     * The files that write for the user at a terminal, where a command line is the right thing to show.
     */
    private const array FOR_THE_USER = [
        'app/Values/DeviceOverview.php',
        'app/Calls/Connections/RunProjectCommandCall.php',
    ];

    public function test_no_agent_text_names_a_journal_command_line(): void
    {
        $files = DomainFiles::in([app_path(), base_path('lang'), ...glob(base_path('domain/*/src')) ?: []]);
        $allowed = self::FOR_THE_USER;
        $found = [];

        foreach ($files as $file) {
            $relative = str_replace(base_path().'/', '', $file);

            if (in_array($relative, $allowed, true)) {
                continue;
            }

            foreach (self::textsOf((string) file_get_contents($file)) as [$line, $text]) {
                if (preg_match(self::COMMAND_LINE, $text) === 1) {
                    $found[] = "{$relative}:{$line}";
                }
            }
        }

        $this->assertSame([], $found);
    }

    public function test_the_tools_the_texts_name_are_in_the_catalogue(): void
    {
        $named = [
            ContinueHelperTool::NAME,
            SendHelperTool::NAME,
            OutputsReadTool::NAME,
            CommandTypeProposeTool::NAME,
            CommandRequestShowTool::NAME,
            CommandRequestSampleTool::NAME,
            CommandRequestProveTool::NAME,
        ];

        $this->assertSame($named, array_values(array_intersect($named, $this->app->make(JournalToolNames::class)->toolNames())));
    }

    /**
     * The string literals of a PHP file with their lines; comments are not texts.
     *
     * @return list<array{int, string}>
     */
    private static function textsOf(string $source): array
    {
        $texts = [];

        foreach (token_get_all($source) as $token) {
            if (is_array($token) && in_array($token[0], [T_CONSTANT_ENCAPSED_STRING, T_ENCAPSED_AND_WHITESPACE], true)) {
                $texts[] = [$token[2], $token[1]];
            }
        }

        return $texts;
    }
}
