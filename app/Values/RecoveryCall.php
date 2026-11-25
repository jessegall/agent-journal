<?php

declare(strict_types=1);

namespace App\Values;

use Spatie\LaravelData\Data;

/**
 * The tool call that gets an agent out of a refusal: the journal tool to call next and the arguments to call it
 * with, sent along with the refusal as its next action, such as reading the message it must answer first.
 */
final class RecoveryCall extends Data
{
    /**
     * @param  array<string, string>  $arguments
     */
    public function __construct(public readonly string $tool, public readonly array $arguments = []) {}

    /**
     * The details a refusal gives a caller for a recovery: its next action, or none without one.
     *
     * @return array<string, array{tool: string, arguments: object}>
     */
    public static function detailsOf(self|null $recovery): array
    {
        if ($recovery === null) {
            return [];
        }

        return ['next_action' => [
            'tool' => $recovery->tool,
            'arguments' => (object) $recovery->arguments,
        ]];
    }
}
