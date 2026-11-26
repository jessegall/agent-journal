<?php

declare(strict_types=1);

namespace App\Docking\Cards;

use App\Exceptions\DockCardInvalid;
use App\Processes\Enums\ConsoleStream;
use App\Processes\Enums\PartType;
use App\Support\Cards\Contracts\DockPart;
use App\Support\Cards\PartKey;

/**
 * The last lines of a stream as plain text, with terminal controls removed, and whether more was left out.
 */
final readonly class ConsoleOutput implements DockPart
{
    public const int LINE_LIMIT = 40;

    public const int LINE_CHARACTER_LIMIT = 500;

    private const string TERMINAL_CONTROLS = '/\e\[[0-?]*[ -\/]*[@-~]|\e\][^\a]*\a|[\x00-\x08\x0b-\x1f\x7f]/';

    public string $key;

    /**
     * @var list<string>
     */
    public array $lines;

    /**
     * @param  list<string>  $lines
     */
    public function __construct(
        string $key,
        public ConsoleStream $stream,
        array $lines,
        public bool $isTruncated,
        public DockDestination|null $open = null,
    ) {
        PartKey::assertGiven($key, PartType::ConsoleOutput);

        if (count($lines) > self::LINE_LIMIT) {
            throw DockCardInvalid::tooMuchText($key, self::LINE_LIMIT);
        }

        $this->key = $key;
        $this->lines = array_map(self::plain(...), $lines);
    }

    private static function plain(string $line): string
    {
        return mb_substr((string) preg_replace(self::TERMINAL_CONTROLS, '', $line), 0, self::LINE_CHARACTER_LIMIT);
    }

    public function key(): string
    {
        return $this->key;
    }

    public function type(): PartType
    {
        return PartType::ConsoleOutput;
    }

    public function children(): array
    {
        return [];
    }
}
