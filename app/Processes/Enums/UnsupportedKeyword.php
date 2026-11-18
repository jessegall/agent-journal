<?php

declare(strict_types=1);

namespace App\Processes\Enums;

use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Syntax\TokenCursor;

/**
 * A shell keyword that opens a construct the grammar does not support, with the word that closes it.
 */
enum UnsupportedKeyword: string
{
    case If = 'if';
    case While = 'while';
    case Until = 'until';
    case For = 'for';
    case Select = 'select';
    case Case = 'case';
    case Coproc = 'coproc';

    /**
     * Whether the word at the cursor is one of these keywords.
     */
    public static function startsAt(TokenCursor $cursor): bool
    {
        return in_array($cursor->currentLiteral(), array_column(self::cases(), 'value'), true);
    }

    /**
     * The keyword at the cursor; the caller has checked startsAt first.
     *
     * @throws ShellGrammarStopped when the word at the cursor is no such keyword
     */
    public static function at(TokenCursor $cursor): self
    {
        foreach (self::cases() as $keyword) {
            if ($keyword->value === $cursor->currentLiteral()) {
                return $keyword;
            }
        }

        throw ShellGrammarStopped::invalid('An unsupported keyword is missing here.', $cursor->position());
    }

    /**
     * The word that closes the construct, or null for coproc, which runs one command and has none.
     */
    public function terminator(): string|null
    {
        return match ($this) {
            self::If => 'fi',
            self::While, self::Until, self::For, self::Select => 'done',
            self::Case => 'esac',
            self::Coproc => null,
        };
    }

    /**
     * The keywords a terminator closes, so a construct nested in another of its type is counted.
     *
     * @return list<string>
     */
    public static function closedBy(string|null $terminator): array
    {
        $keywords = [];
        foreach (self::cases() as $keyword) {
            if ($keyword->terminator() === $terminator) {
                $keywords[] = $keyword->value;
            }
        }

        return $keywords;
    }
}
