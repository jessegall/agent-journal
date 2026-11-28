<?php

declare(strict_types=1);

namespace App\Values;

use App\Agents\Inputs\Values\FileChanges;

/**
 * The name and subject of a running tool call, with secrets masked and long paths shortened to their file names.
 */
final readonly class ToolLine
{
    /**
     * The most characters a tool line holds.
     */
    public const int TEXT_CHARACTER_LIMIT = 200;

    private const string SHELL_TOOL = 'Bash';

    private const string LONG_PATH = '~(?<![\w.\~/:-])(?:[\w.\~-]*/){3,}([^\s/\'"]+)~u';

    private function __construct(public string $text) {}

    /**
     * A shell command the agent runs, under the one shell name for every driver.
     */
    public static function shell(string $source): self
    {
        return self::named(self::SHELL_TOOL, ShownShellLine::of(trim($source)));
    }

    /**
     * The shell line a rewrite runs in place of the agent's own.
     */
    public static function rewritten(string $line): self
    {
        return self::shell($line);
    }

    /**
     * A file edit, named by what it does to its first file and every file it changes.
     */
    public static function files(FileChanges $changes): self
    {
        $verb = $changes->changes === [] ? 'Edit' : ucfirst($changes->changes[0]->operation->value);

        return self::named($verb, implode(', ', $changes->paths()));
    }

    /**
     * Any other native tool call, named by its tool and the first resource it acts on.
     */
    public static function operation(Operation $operation): self
    {
        $nameParts = explode(':', $operation->name, 2);
        $name = end($nameParts);
        $subject = $operation->resources === [] ? '' : $operation->resources[0]->target;

        return self::named($name, $subject);
    }

    private static function named(string $tool, string $subject): self
    {
        $line = trim("{$tool} ".preg_replace(self::LONG_PATH, '…/$1', $subject));

        return new self(mb_substr($line, 0, self::TEXT_CHARACTER_LIMIT));
    }
}
