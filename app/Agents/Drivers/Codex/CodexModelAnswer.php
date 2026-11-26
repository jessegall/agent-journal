<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Accounts\Data\CodexEventData;
use App\Agents\Drivers\Setup\Contracts\ModelAnswerReader;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

/**
 * Reads `codex exec --json`: answered when its turn completes, the provider's refusal when it fails; Codex saves any
 * key unchecked, so this call is the only proof the key works.
 */
final readonly class CodexModelAnswer implements ModelAnswerReader
{
    public function __invoke(string $output, int|null $exitCode): string|null
    {
        foreach (explode("\n", $output) as $line) {
            try {
                $event = CodexEventData::from(json_decode($line, true, 64, JSON_THROW_ON_ERROR));
            } catch (JsonException|CannotCreateData|TypeError) {
                continue;
            }

            if ($event->type === 'turn.completed') {
                return null;
            }

            if ($event->type === 'turn.failed') {
                if ($event->error === null) {
                    return 'Codex could not reach the model.';
                }

                return $event->error->message;
            }
        }

        return 'Codex gave no readable answer.';
    }
}
