<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\SectionMissing;

/**
 * A bounded read of a text: the selected part, the lines it spans and, when it was cut, the selection that reads on
 * from where it stopped, at the same version.
 */
final class TextReading
{
    /**
     * @return array{text: string, lines: string, continuation?: string}
     *
     * @throws SectionMissing
     */
    public static function read(MarkdownText $text, TextSelection $selection, int $version): array
    {
        $part = $text->part($selection);
        $read = ['text' => $part->text, 'lines' => "{$part->firstLine}-{$part->lastLine}"];

        if ($part->nextLine === null) {
            return $read;
        }

        $end = $selection->lastLine ?? '';

        return [
            ...$read,
            'continuation' => "--lines {$part->nextLine}-{$end} --at-revision {$version}".($selection->bullets
                ? ' --bullets'
                : '').($selection->words !== null
                ? " --grep \"{$selection->words}\"" : ''),
        ];
    }
}
