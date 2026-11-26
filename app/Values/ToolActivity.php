<?php

declare(strict_types=1);

namespace App\Values;

use App\Agents\Drivers\ClaudeCode\Enums\ClaudeCodeTool;
use App\Enums\Agents\ActivityType;
use App\Enums\Drivers\CodexTool;
use App\Support\Inputs\Values\FileChanges;
use App\Support\Inputs\Values\ToolResult;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * What a finished tool call shows of an agent's work: a file it read or edited, or a command it ran. A command that
 * looks like it carries a secret keeps only its first word, and no tool's output is ever kept.
 */
final readonly class ToolActivity
{
    private const string SECRET_WORDS = '~token|secret|passw|api[_-]?key|authorization|bearer|credential~i';

    private function __construct(
        public ActivityType $type,
        public string $subject,
    ) {}

    /**
     * @return Option<self>
     */
    public static function of(ToolResult $call): Option
    {
        $claude = ClaudeCodeTool::tryFrom($call->toolName);
        $read = $call->arguments->presentTexts('file_path', 'path', 'pattern');
        $edited = $call->arguments->presentTexts('file_path', 'notebook_path');
        $codex = CodexTool::tryFrom($call->toolName);

        return match (true) {
            $claude === ClaudeCodeTool::Bash, $codex?->isShell() === true => self::ran($call),
            $claude?->isFileReader() === true => self::named(ActivityType::Read, $read),
            $claude?->changesFiles() === true => self::named(ActivityType::Edited, $edited),
            $codex === CodexTool::ApplyPatch => self::patched($call),
            default => None::create(),
        };
    }

    /**
     * @return Option<self>
     */
    private static function ran(ToolResult $call): Option
    {
        $command = trim((string) $call->arguments->textArgument('command'));

        if ($command === '') {
            return None::create();
        }

        if (preg_match(self::SECRET_WORDS, $command) === 1) {
            return new Some(new self(ActivityType::Ran, strtok($command, " \t\n").' with a private value'));
        }

        return new Some(new self(ActivityType::Ran, $command));
    }

    /**
     * @param  list<string>  $texts
     * @return Option<self>
     */
    private static function named(ActivityType $type, array $texts): Option
    {
        if ($texts === []) {
            return None::create();
        }

        return new Some(new self($type, $texts[0]));
    }

    /**
     * @return Option<self>
     */
    private static function patched(ToolResult $call): Option
    {
        $paths = FileChanges::fromPatch($call->arguments->firstText('command'))->paths();

        return new Some(new self(ActivityType::Edited, implode(', ', $paths)));
    }
}
