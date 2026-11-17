<?php

declare(strict_types=1);

namespace App\Domain\Processes;

use App\Core\Hooks\Inputs\PartJoin;

/**
 * A shell line split into words and the operators between them, honouring quotes and backslashes.
 * It notes a variable, command substitution or glob, and a quote left open, instead of guessing past them.
 */
final readonly class ShellWords
{
    private const array OPERATORS = ['||' => PartJoin::Or, '&&' => PartJoin::And, '|' => PartJoin::Pipe, ';' => PartJoin::Sequence];

    /**
     * @param  list<ShellSegment>  $segments
     */
    private function __construct(
        private array $segments,
        private bool $isComplete,
        private bool $hasExpansion,
    ) {}

    public static function of(string $line): self
    {
        $segments = [];
        $words = [];
        $word = '';
        $hasWord = false;
        $quote = null;
        $hasExpansion = false;
        $length = strlen($line);
        $index = 0;

        while ($index < $length) {
            $character = $line[$index];

            if ($quote === "'") {
                $quote = $character === "'" ? null : $quote;
                $word .= $character === "'" ? '' : $character;
                $index++;

                continue;
            }

            if ($character === '\\' && $index + 1 < $length) {
                $word .= $line[$index + 1];
                $hasWord = true;
                $index += 2;

                continue;
            }

            if ($quote === '"') {
                $hasExpansion = $hasExpansion || $character === '$' || $character === '`';
                $quote = $character === '"' ? null : $quote;
                $word .= $character === '"' ? '' : $character;
                $index++;

                continue;
            }

            if ($character === "'" || $character === '"') {
                $quote = $character;
                $hasWord = true;
                $index++;

                continue;
            }

            if ($character === '>' || $character === '<') {
                $descriptor = $hasWord && ctype_digit($word) ? $word : '';

                if ($hasWord && $descriptor === '') {
                    $words[] = $word;
                }

                [$redirect, $index] = self::redirectAt($line, $index);
                $words[] = $descriptor.$redirect;
                $word = '';
                $hasWord = false;

                continue;
            }

            $operator = self::operatorAt($line, $index);

            if ($operator !== null || ctype_space($character)) {
                if ($hasWord) {
                    $words[] = $word;
                }

                $word = '';
                $hasWord = false;

                if ($operator !== null) {
                    $segments[] = new ShellSegment($words, self::OPERATORS[$operator]);
                    $words = [];
                    $index += strlen($operator);

                    continue;
                }

                $index++;

                continue;
            }

            $hasExpansion = $hasExpansion || in_array($character, ['$', '`', '*', '?', '['], true);
            $word .= $character;
            $hasWord = true;
            $index++;
        }

        if ($hasWord) {
            $words[] = $word;
        }

        $segments[] = new ShellSegment($words, PartJoin::End);

        return new self($segments, $quote === null, $hasExpansion);
    }

    /**
     * @return list<ShellSegment>
     */
    public function segments(): array
    {
        return $this->segments;
    }

    public function isComplete(): bool
    {
        return $this->isComplete;
    }

    public function hasExpansion(): bool
    {
        return $this->hasExpansion;
    }

    /**
     * The redirect starting at the index, such as >, >>, < or >&1, and the index after it.
     *
     * @return array{string, int}
     */
    private static function redirectAt(string $line, int $index): array
    {
        $redirect = preg_match('/\G(>>|>|<)(&\d+)?/', $line, $match, 0, $index) === 1 ? $match[0] : $line[$index];

        return [$redirect, $index + strlen($redirect)];
    }

    private static function operatorAt(string $line, int $index): ?string
    {
        foreach (array_keys(self::OPERATORS) as $operator) {
            if (substr($line, $index, strlen($operator)) === $operator) {
                return $operator;
            }
        }

        return null;
    }
}
